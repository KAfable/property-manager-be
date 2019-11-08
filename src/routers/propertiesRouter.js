const router = require('express').Router();

const Properties = require('../controllers/propertiesModel');


// retrieves every property object in the database

router.get('/', (req, res) => {
    Properties.getAll()
      .then(properties => {
        res.status(201).json(properties);
      })
      .catch(err => {
        res.status(400).json({ message: err });
      })
  })

module.exports = router;