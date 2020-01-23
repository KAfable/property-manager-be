const jwt = require('jsonwebtoken')
const User = require('../models/user')

const bearerAuth = async (req, res, next) => {
  // We get the authorization header and default to an empty string
  const credentials = req.headers.authorization || ''

  const [type, payload] = credentials.split(' ')

  /*
   * To make our middleware graceful, we want to make sure that the authorzation
   * type is Bearer before proceeding as we may implement other authorization
   * methods in the future.
   * */
  if (type === 'Bearer') {
    try {
      const token = jwt.decode(payload)

      const user = await User.findByEmail(token.sub, token.type)

      /* eslint-disable-next-line */
      req.user = user

      next()
    } catch (err) {
      return res.status(401).send({error: 'You are not authorized'})
    }
  } else {
    next()
  }
}

module.exports = bearerAuth
