const PointsPayloads = {

  postSendPoints: (cpf, value) => ({
    recipientCpf: cpf,
    amount: value
  })
}

module.exports = {
  PointsPayloads
};