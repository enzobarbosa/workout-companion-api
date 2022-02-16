const jwt = require('jsonwebtoken')

const generateToken = async (payload, callback) => {
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' }, (error, token) => {
    if (error) callback(error)
    callback(null, token)
  })
}

const extractIdFromRequestAuthHeader = (req) => {
  const { authorization } = req.header.authorization
  if (authorization) {
    const token = authorization.split(' ')[1]
    if (token) {
      return jwt.decode(token).id
    }
  }
}

module.exports = {
  generateToken,
  extractIdFromRequestAuthHeader
}
