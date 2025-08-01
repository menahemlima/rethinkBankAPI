const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { PointsPayloads } = require('../pojos/points.payloads');
const { AuthManager } = require('../utils/auth');
const { GenerateUserData } = require('../utils/functions');

const API_BASE_URL = process.env.API_BASE_URL;

let userData01;
let userData02;

describe('Testes para pontuação', () => {
    beforeAll(async () => {
        userData01 = GenerateUserData.generateNewUser();
        userData02 = GenerateUserData.generateNewUser();

        token1 = await AuthManager.createLoginReturnCpf(userData01.cpf);
        token2 = await AuthManager.createLoginReturnCpf(userData02.cpf);
    });

    it('Cenário: Verificar saldo de um novo usuário cadastrado', async () => {
        const resBalance = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.BALANCE)
            .set('Authorization', `Bearer ${token1}`)
            .send();

        expect(resBalance.statusCode).toBe(200);
        expect(resBalance.body).toHaveProperty('normal_balance', 100);
        expect(resBalance.body.normal_balance).not.toBeNull();
        expect(resBalance.body.piggy_bank_balance).not.toBeNull();
    });

    it('Cenário: Enviar pontos para si mesmo', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints(userData01.cpf, 50);
        const resPoints = await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer ${token1}`)
            .send(sendPointsPayload);

        expect(resPoints.statusCode).toBe(400);
        expect(resPoints.body).toHaveProperty('error', 'Não deve enviar pontos para si mesmo');
        expect(resPoints.body.error).not.toBeNull();
        expect(typeof resPoints.body.error).toBe('string');
    });

    it('Cenário: Enviar pontos para outro usuário com valor inteiro', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints(userData02.cpf, 50);
        const resPoints = await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer ${token1}`)
            .send(sendPointsPayload);

        expect(resPoints.statusCode).toBe(200);
        expect(resPoints.body).toHaveProperty('message', 'Pontos enviados com sucesso.');
        expect(resPoints.body.message).not.toBeNull();
        expect(typeof resPoints.body.message).toBe('string');
    });

    it('Cenário: Enviar pontos com valor negativo', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints(userData02.cpf, -50);
        const resPoints = await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer ${token1}`)
            .send(sendPointsPayload);

        expect(resPoints.statusCode).toBe(400);
        expect(resPoints.body).toHaveProperty('error', 'Valor inválido');
        expect(resPoints.body.error).not.toBeNull();
        expect(typeof resPoints.body.error).toBe('string');
    });

    it('Cenário: Enviar pontos com token inválido', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints(userData02.cpf, 50);
        const resPoints = await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer 12385fsdfadfa`)
            .send(sendPointsPayload);

        expect(resPoints.statusCode).toBe(401);
        expect(resPoints.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resPoints.body.error).not.toBeNull();
        expect(typeof resPoints.body.error).toBe('string');
    });

    it('Cenário: Enviar pontos para usuário não existente', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints("74185296325", 1);
        const resPoints = await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer ${token2}`)
            .send(sendPointsPayload);

        expect(resPoints.statusCode).toBe(404);
        expect(resPoints.body).toHaveProperty('error', 'Usuário destino não encontrado');
        expect(resPoints.body.error).not.toBeNull();
        expect(typeof resPoints.body.error).toBe('string');
    });

    it('Cenário: Verificar extrato', async () => {
        const resExtract = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.EXTRACT)
            .set('Authorization', `Bearer ${token1}`)
            .send();

        expect(resExtract.statusCode).toBe(200);
        expect(resExtract.body.id).not.toBeNull();
        expect(resExtract.body.from_user).not.toBeNull();
        expect(resExtract.body.to_user).not.toBeNull();
        expect(resExtract.body.amount).not.toBeNull();
        expect(resExtract.body.created_at).not.toBeNull();
    });

    it('Cenário: Verificar extrato com token inválido', async () => {
        const resExtract = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.EXTRACT)
            .set('Authorization', `Bearer 12385fsdfadfa`)
            .send();

        expect(resExtract.statusCode).toBe(401);
        expect(resExtract.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resExtract.body.error).not.toBeNull();
        expect(typeof resExtract.body.error).toBe('string');
    });

    it('Cenário: Verificar saldo do usuário', async () => {
        const resBalance = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.BALANCE)
            .set('Authorization', `Bearer ${token1}`)
            .send();

        expect(resBalance.statusCode).toBe(200);
        expect(resBalance.body.normal_balance).not.toBeNull();
        expect(resBalance.body.piggy_bank_balance).not.toBeNull();
    });

    it('Cenário: Verificar saldo com token inválido', async () => {
        const resBalance = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.BALANCE)
            .set('Authorization', `Bearer 12385fsdfadfa`)
            .send();

        expect(resBalance.statusCode).toBe(401);
        expect(resBalance.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resBalance.body.error).not.toBeNull();
        expect(typeof resBalance.body.error).toBe('string');
    });

    it('Cenário: Verificar saldo após recebimento de pontos', async () => {
        const sendPointsPayload = PointsPayloads.postSendPoints(userData02.cpf, 50);
        await request(API_BASE_URL)
            .post(API_ENDPOINTS.POINTS.SEND)
            .set('Authorization', `Bearer ${token1}`)
            .send(sendPointsPayload);

        const resBalance = await request(API_BASE_URL)
            .get(API_ENDPOINTS.POINTS.BALANCE)
            .set('Authorization', `Bearer ${token2}`)
            .send();

        expect(resBalance.statusCode).toBe(200);
        expect(resBalance.body).toHaveProperty('normal_balance', 100);
        expect(resBalance.body.normal_balance).not.toBeNull();
        expect(resBalance.body.piggy_bank_balance).not.toBeNull();
    });

});