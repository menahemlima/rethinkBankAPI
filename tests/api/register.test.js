const request = require('supertest');
require('dotenv').config();
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { RegisterPayloads } = require('../pojos/register.payloads');
const { GenerateUserData } = require('../utils/functions');

const API_BASE_URL = process.env.API_BASE_URL;

describe('Testes de Registro de Cadastro', () => {

  beforeEach(async () => {
    userData = GenerateUserData.generateNewUser();
  });


  it('Cenário: Cadastrar novo usuário com dados válidos', async () => {
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      userData.fullName, userData.email, userData.password, userData.repeatPass);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(201);
    expect(resReg.body).toHaveProperty('message', 'Cadastro realizado com sucesso.');
    expect(resReg.body).toHaveProperty('confirmToken');
    expect(resReg.body.confirmToken).not.toBeNull();
    expect(typeof resReg.body.confirmToken).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com email inválido', async () => {
    const emailWrong = "email_invalido";
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      userData.fullName, emailWrong, userData.password, userData.repeatPass);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(400);
    expect(resReg.body).toHaveProperty('error', 'Email inválido');
    expect(resReg.body).not.toHaveProperty('confirmToken');
    expect(resReg.body.error).not.toBeNull();
    expect(typeof resReg.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com nome inválido', async () => {
    const nameShort = "Paulo";
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      nameShort, userData.email, userData.password, userData.repeatPass);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(400);
    expect(resReg.body).toHaveProperty('error', 'Nome completo obrigatório');
    expect(resReg.body).not.toHaveProperty('confirmToken');
    expect(resReg.body.error).not.toBeNull();
    expect(typeof resReg.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com cpf inválido', async () => {
    const cpfShort = "123456";
    const newUserPayload = RegisterPayloads.postNewUserPayload(cpfShort,
      userData.fullName, userData.email, userData.password, userData.repeatPass);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(400);
    expect(resReg.body).toHaveProperty('error', 'CPF inválido');
    expect(resReg.body).not.toHaveProperty('confirmToken');
    expect(resReg.body.error).not.toBeNull();
    expect(typeof resReg.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com senhas divergentes', async () => {
    const NewPass = "pass123";
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      userData.fullName, userData.email, NewPass, userData.repeatPass);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(400);
    expect(resReg.body).toHaveProperty('error', 'Senhas não conferem');
    expect(resReg.body).not.toHaveProperty('confirmToken');
    expect(resReg.body.error).not.toBeNull();
    expect(typeof resReg.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com senha fraca', async () => {
    const passShort = "pass123";
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      userData.fullName, userData.email, passShort, passShort);

    const resReg = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg.statusCode).toBe(400);
    expect(resReg.body).toHaveProperty('error', 'Senha fraca');
    expect(resReg.body).not.toHaveProperty('confirmToken');
    expect(resReg.body.error).not.toBeNull();
    expect(typeof resReg.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com email existente', async () => {
    const newEmail = "menah@test.com";
    const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
      userData.fullName, newEmail, userData.password, userData.password);

    await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    const resReg2 = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg2.statusCode).toBe(409);
    expect(resReg2.body).toHaveProperty('error', 'duplicate key value violates unique constraint \"users_email_key\"');
    expect(resReg2.body).not.toHaveProperty('confirmToken');
    expect(resReg2.body.error).not.toBeNull();
    expect(typeof resReg2.body.error).toBe('string');
  });

  it('Cenário: Cadastrar novo usuário com cpf existente', async () => {
    const cpfExist = "38230905002";
    const newUserPayload = RegisterPayloads.postNewUserPayload(cpfExist, userData.fullName, userData.email,
      userData.password, userData.repeatPass);

    await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    const resReg2 = await request(API_BASE_URL)
      .post(API_ENDPOINTS.REGISTER)
      .send(newUserPayload);

    expect(resReg2.statusCode).toBe(409);
    expect(resReg2.body).toHaveProperty('error', 'duplicate key value violates unique constraint \"users_cpf_key\"');
    expect(resReg2.body).not.toHaveProperty('confirmToken');
    expect(resReg2.body.error).not.toBeNull();
    expect(typeof resReg2.body.error).toBe('string');
  });

});