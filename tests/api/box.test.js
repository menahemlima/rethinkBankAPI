const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { BoxPayloads } = require('../pojos/box.payloads');
const { AuthManager } = require('../utils/auth');

const API_BASE_URL = process.env.API_BASE_URL;

describe('Testes para caixinha', () => {
    beforeAll(async () => {
        token = await AuthManager.postLogin();
    });

    it('Cenário: Depositar de valor na caixinha', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(30);
        const resBox = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        expect(resBox.statusCode).toBe(200);
        expect(resBox.body).toHaveProperty('message', 'Depósito na caixinha realizado.');
        expect(resBox.body.message).not.toBeNull();
        expect(typeof resBox.body.message).toBe('string');
    });

    it('Cenário: Depositar valor acima do disponível na conta', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(5000);
        const resBox = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        expect(resBox.statusCode).toBe(400);
        expect(resBox.body).toHaveProperty('error', 'Saldo insuficiente');
        expect(resBox.body.error).not.toBeNull();
        expect(typeof resBox.body.error).toBe('string');
    });

    it('Cenário: Depositar valor com token inválido', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(20);
        const resBox = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer dfasd123`)
            .send(depositPayload);

        expect(resBox.statusCode).toBe(401);
        expect(resBox.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resBox.body.error).not.toBeNull();
        expect(typeof resBox.body.error).toBe('string');
    });

    it('Cenário: Resgatar valor da caixinha', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(30);
        await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        const withdrawPayload = BoxPayloads.postWithdraw(1);
        const resBox02 = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.WITHDRAW)
            .set('Authorization', `Bearer ${token}`)
            .send(withdrawPayload);

        expect(resBox02.statusCode).toBe(200);
        expect(resBox02.body).toHaveProperty('message', 'Resgate da caixinha realizado.');
        expect(resBox02.body.message).not.toBeNull();
        expect(typeof resBox02.body.message).toBe('string');
    });

    it('Cenário: Resgatar valor da caixinha informando token inválido', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(30);
        await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        const withdrawPayload = BoxPayloads.postWithdraw(1);
        const resBox02 = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.WITHDRAW)
            .set('Authorization', `Bearer 123asdf`)
            .send(withdrawPayload);

        expect(resBox02.statusCode).toBe(401);
        expect(resBox02.body).toHaveProperty('error', 'Token inválido ou expirado');
        expect(resBox02.body.error).not.toBeNull();
        expect(typeof resBox02.body.error).toBe('string');
    });

    it('Cenário: Resgatar valor da caixinha informando número negativo', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(30);
        await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        const withdrawPayload = BoxPayloads.postWithdraw(-10);
        const resBox02 = await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.WITHDRAW)
            .set('Authorization', `Bearer ${token}`)
            .send(withdrawPayload);

        expect(resBox02.statusCode).toBe(400);
        expect(resBox02.body).toHaveProperty('error', 'Nao deve ser possível resgatar um valor negativo');
        expect(resBox02.body.error).not.toBeNull();
        expect(typeof resBox02.body.error).toBe('string');
    });

    it('Cenário: Verificar extrato da caixinha após depósito', async () => {
        const depositPayload = BoxPayloads.postDepositPoints(40);
        await request(API_BASE_URL)
            .post(API_ENDPOINTS.BOX.DEPOSIT)
            .set('Authorization', `Bearer ${token}`)
            .send(depositPayload);

        const resBox02 = await request(API_BASE_URL)
            .get(API_ENDPOINTS.BOX.EXTRACT)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(resBox02.statusCode).toBe(200);
        expect(resBox02.body[0]).toHaveProperty('amount', 40);
        expect(resBox02.body.id).not.toBeNull();
        expect(resBox02.body.user_id).not.toBeNull();
        expect(resBox02.body.type).not.toBeNull();
        expect(resBox02.body.amount).not.toBeNull();
        expect(resBox02.body.created_at).not.toBeNull();
    });

});





