const R = require('ramda')
const User = require('../../models/user')
const firebase = require('../../lib/firebase')
const jwt = require('../../lib/jwt')

async function createUser(req, res) {
  const {email, password, type} = req.body

  try {
    // Create the user
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    if (!user) {
      return res.status(400).json({message: 'Account not created'})
    }

    const payload = {email, type}

    const token = jwt.signToken(payload)

    res.status(201).json({
      token,
      user: {
        type,
        email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    })
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return res.status(400).json({message: 'Email is already used'})
    }

    // TODO: Come back and address additional issues from firebase
    res.status(500).json(err)
  }
}

async function login(req, res) {
  const {email, password} = req.body

  try {
    /*
     * Firebase auth does some magical stuff here.
     * If the users login info is correct, it sets the current user on the
     * global firebase application instance that can be retrieved with
     * firebase.auth().currentUser
     * */
    await firebase.auth().signInWithEmailAndPassword(email, password)

    const foundUser = await User.findByEmail(email)

    const user = R.pick(['type', 'email', 'firstName', 'lastName'], foundUser)

    const token = jwt.signToken(user)

    res.status(200).json({token, user})
  } catch (err) {
    res.status(401).json({
      error: 'Invalid credentials',
    })
  }
}

module.exports = {
  createUser,
  login,
}
