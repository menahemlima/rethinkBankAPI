require('dotenv').config();

module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  testEnvironment: 'node',
  testTimeout: 30000,
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Relatório testes JEST',
      outputPath: './reporter/reportResult.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ]
};