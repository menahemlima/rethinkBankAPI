const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { RegisterPayloads } = require('../pojos/register.payloads');
const { AuthManager } = require('../utils/auth');
const { GenerateUserData } = require('../utils/functions');

const API_BASE_URL = process.env.API_BASE_URL;

describe('Testes de Login', () => {

    it('Cenário: Realizar login com sucesso', async () => {
        const token = await AuthManager.postLogin();

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
    });

    it('Cenário: Realizar login com email não cadastrado', async () => {
        const userData = GenerateUserData.generateNewUser();
        const emailNotExist = "email@notexist.com.br";
        const password = userData.password;
        const loginPayload = RegisterPayloads.postLoginPayload(emailNotExist, password);
        const resLogin = await request(API_BASE_URL)
            .post(API_ENDPOINTS.LOGIN)
            .send(loginPayload);

        expect(resLogin.statusCode).toBe(400);
        expect(resLogin.body).toHaveProperty('error', 'Credenciais inválidas');
        expect(resLogin.body.error).not.toBeNull();
        expect(typeof resLogin.body.error).toBe('string');
    });

});