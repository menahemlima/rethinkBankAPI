const { faker } = require('@faker-js/faker');

const GeneratePassword = {

  generateComplexPassword: (length = 10) => {
    const chars = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      digits: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const allChars = chars.lower + chars.upper + chars.digits + chars.special;

    let password = '';

    password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
    password += chars.digits[Math.floor(Math.random() * chars.digits.length)];
    password += chars.special[Math.floor(Math.random() * chars.special.length)];

     for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    if (password.length < 8) {
      for (let i = password.length; i < 8; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
      }
    }

    return password;
  }
}


class GenerateUserData {
  static generateNewUser() {
    const cpf = faker.string.numeric(11);
    const fullName = faker.person.firstName() + " " + faker.person.lastName();
    const email = faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() });
    const password = GeneratePassword.generateComplexPassword(10);
    const repeatPass = password;

    return {
      cpf,
      fullName,
      email,
      password,
      repeatPass,
    };
  }
}

module.exports = { GenerateUserData };