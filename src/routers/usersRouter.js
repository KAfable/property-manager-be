const router = require('express').Router();

const Users = require('../controllers/usersModel');


// retrieves every user object in the database

router.get('/', (req, res) => {
    Users.getAll()
      .then(users => {
        res.status(201).json(users);
      })
      .catch(err => {
        res.status(400).json({ message: err });
      })
  })

module.exports = router;