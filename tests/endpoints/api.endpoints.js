const API_ENDPOINTS = {

  REGISTER: '/cadastro',
  CONFIRM_EMAIL: '/confirm-email',
  LOGIN: '/login',
  DELETE_ACCOUNT: '/account',

  POINTS: {
    SEND: '/points/send',
    EXTRACT: '/points/extrato',
    BALANCE: '/points/saldo',
  },

  BOX: {
    DEPOSIT: '/caixinha/deposit',
    WITHDRAW: '/caixinha/withdraw',
    EXTRACT: '/caixinha/extrato',
  },

};

module.exports = {
  API_ENDPOINTS,
};