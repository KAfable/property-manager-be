function isValidEmail(email) {
  // this is a very naive non-exhausted check
  const regex = /.+@[a-z]+\.[a-z]+/gi

  return regex.test(email)
}

const validateAuthInput = (requireType = false) => (req, res, next) => {
  const {email, password, type} = req.body

  let errors = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'The email supplied is not valid'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'The password must be 8 characters long'
  }

  // Refactor this out at some point
  if (requireType) {
    if (!type) {
      errors.type = 'type is required'
    } else if (type !== 'landlord' && type !== 'tenant') {
      errors.type = 'type must either be landlord or tenant'
    }
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      errors,
    })
    return
  }

  next()
}

module.exports = validateAuthInput
