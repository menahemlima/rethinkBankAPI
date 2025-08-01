const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { RegisterPayloads } = require('../pojos/register.payloads');
const { GenerateUserData } = require('../utils/functions');
const { AuthManager } = require('../utils/auth');

const API_BASE_URL = process.env.API_BASE_URL;

let token;
let userData;

describe('Testes para exclusão de usuário', () => {

    beforeEach(async () => {
        token = await AuthManager.postLogin();
        userData = GenerateUserData.generateNewUser();
    });


    it('Cenário: Excluir usuário informando senha válida', async () => {
        const password = userData.password;
        token = String(await AuthManager.createLoginReturnPassword(password));
        const deletePayload = RegisterPayloads.deleteUserPayload(password);
        const resDel = await request(API_BASE_URL)
            .delete(API_ENDPOINTS.DELETE_ACCOUNT)
            .set('Authorization', `Bearer ${token}`)
            .send(deletePayload);

        expect(resDel.statusCode).toBe(200);
        expect(resDel.body).toHaveProperty('message', 'Conta marcada como deletada.');
        expect(resDel.body.message).not.toBeNull();
        expect(typeof resDel.body.message).toBe('string');
    });


    it('Cenário: Excluir usuário informando senha inválida', async () => {
        const wrongPassword = "senha_errada";

        const deletePayload = RegisterPayloads.deleteUserPayload(wrongPassword);
        const resDel = await request(API_BASE_URL)
            .delete(API_ENDPOINTS.DELETE_ACCOUNT)
            .set('Authorization', `Bearer ${token}`)
            .send(deletePayload);

        expect(resDel.statusCode).toBe(400);
        expect(resDel.body).toHaveProperty('error', 'Senha inválida');
        expect(resDel.body.error).not.toBeNull();
        expect(typeof resDel.body.error).toBe('string');
    });


    it('Cenário: Excluir usuário informando senha inválida', async () => {
        const deletePayload = RegisterPayloads.deleteUserPayload(process.env.PASSWORD);
        const tokenExp = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlOGVlZjBmNy02Y2Y5LTQwMmUtOTNkMC1hNzAyYzlhNTQ4NzQiLCJpYXQiOjE3NTM5MjQ0MjUsImV4cCI6MTc1MzkyNTAyNX0.tZM64RTzoEbyqnrhW0BfA7OmVeeal89iuLWP7Dcercg";
        const resDel = await request(API_BASE_URL)
            .delete(API_ENDPOINTS.DELETE_ACCOUNT)
            .set('Authorization', `Bearer ${tokenExp}`)
            .send(deletePayload);

        expect(resDel.statusCode).toBe(401);
        expect(resDel.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resDel.body.error).not.toBeNull();
        expect(typeof resDel.body.error).toBe('string');
    });


});