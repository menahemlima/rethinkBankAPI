const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { RegisterPayloads } = require('../pojos/register.payloads');
const { GenerateUserData } = require('../utils/functions');

const API_BASE_URL = process.env.API_BASE_URL;

describe('Testes para Confirmação de E-mail', () => {

    it('Cenário: Confirmar o e-mail de um usuário novo cadastrado', async () => {
        const userData = GenerateUserData.generateNewUser();
        const newUserPayload = RegisterPayloads.postNewUserPayload(userData.cpf,
            userData.fullName, userData.email, userData.password, userData.password);

        const resCheck = await request(API_BASE_URL)
            .post(API_ENDPOINTS.REGISTER)
            .send(newUserPayload);
        const confirmToken = String(resCheck.body.confirmToken);

        const resCheck2 = await request(API_BASE_URL)
            .get(`${API_ENDPOINTS.CONFIRM_EMAIL}?token=${confirmToken}`);

        expect(resCheck2.statusCode).toBe(200);
        expect(resCheck2.text).toContain('E-mail confirmado com sucesso.');
    });

    it('Cenário: Confirmar email informando token inválido', async () => {
        const confirmToken = "12345sdfasdf";

        const resCheck = await request(API_BASE_URL)
            .get(`${API_ENDPOINTS.CONFIRM_EMAIL}?token=${confirmToken}`);

        expect(resCheck.statusCode).toBe(400);
        expect(resCheck.text).toContain('Token inválido ou expirado.');
    });
});