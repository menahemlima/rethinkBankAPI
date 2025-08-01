const RegisterPayloads = {

  postNewUserPayload: (cpf, fullName, email, password, repeatPass) => ({
    cpf: cpf,
    full_name: fullName,
    email: email,
    password: password,
    confirmPassword: repeatPass
  }),

  postLoginPayload: (email, password) => ({
    email: email,
    password: password
  }),

  deleteUserPayload: (password) => ({
    password: password
  })
}

module.exports = {
  RegisterPayloads
};