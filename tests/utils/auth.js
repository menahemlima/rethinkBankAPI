const request = require('supertest');
const { API_ENDPOINTS } = require('../endpoints/api.endpoints');
const { RegisterPayloads } = require('../pojos/register.payloads');
const { GenerateUserData } = require('../utils/functions');

const API_BASE_URL = process.env.API_BASE_URL;

const registerAndLogin = async (userData) => {
    try {
        const registerPayload = RegisterPayloads.postNewUserPayload(
            userData.cpf,
            userData.fullName,
            userData.email,
            userData.password,
            userData.repeatPass
        );

        const resRegister = await request(API_BASE_URL)
            .post(API_ENDPOINTS.REGISTER)
            .send(registerPayload);

        if (resRegister.statusCode !== 201) {
            throw new Error(`Falha ao registrar novo usuário: ${resRegister.statusCode} - ${JSON.stringify(resRegister.body)}`);
        }

        if (!resRegister.body.confirmToken) {
            throw new Error('Token de confirmação de e-mail não retornado. Não é possível prosseguir.');
        }

        const confirmToken = String(resRegister.body.confirmToken);
        const resConfirm = await request(API_BASE_URL)
            .get(`${API_ENDPOINTS.CONFIRM_EMAIL}?token=${confirmToken}`);

        if (resConfirm.statusCode !== 200) {
            throw new Error(`Falha ao confirmar e-mail do novo usuário: ${resConfirm.statusCode} - ${JSON.stringify(resConfirm.body || resConfirm.text)}`);
        }

        const loginPayload = RegisterPayloads.postLoginPayload(userData.email, userData.password);
        const resNewLogin = await request(API_BASE_URL)
            .post(API_ENDPOINTS.LOGIN)
            .send(loginPayload);

        if (resNewLogin.statusCode === 200) {
            return resNewLogin.body.token;
        } else {
            throw new Error(`Falha ao fazer login com o novo usuário após registro e confirmação: ${resNewLogin.statusCode} - ${JSON.stringify(resNewLogin.body)}`);
        }

    } catch (error) {
        throw error;
    }
};

const AuthManager = {
    postLogin: async () => {
        const email = process.env.EMAIL;
        const password = process.env.PASSWORD;

        if (email && password) {
            const loginPayload = RegisterPayloads.postLoginPayload(email, password);
            const resLogin = await request(API_BASE_URL)
                .post(API_ENDPOINTS.LOGIN)
                .send(loginPayload);

            if (resLogin.statusCode === 200) {
                return resLogin.body.token;
            }
        }

        const newUserData = GenerateUserData.generateNewUser();
        return registerAndLogin(newUserData);
    },

    createLoginReturnPassword: async (password) => {
        const newUserData = GenerateUserData.generateNewUser();
        newUserData.password = password;
        newUserData.repeatPass = password;
        return registerAndLogin(newUserData);
    },

    createLoginReturnCpf: async (cpf) => {
        const newUserData = GenerateUserData.generateNewUser();
        newUserData.cpf = cpf;
        return registerAndLogin(newUserData);
    }
};

module.exports = { AuthManager };