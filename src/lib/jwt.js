const jwt = require('jsonwebtoken')

const signToken = user => {
  const secret = process.env.JWT_SECRET || '1234'

  return jwt.sign({sub: user.email, type: user.type}, secret, {expiresIn: '7d'})
}

module.exports = {signToken}
