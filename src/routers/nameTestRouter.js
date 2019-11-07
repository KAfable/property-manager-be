const router = require('express').Router();

const Names = require('../controllers/example');


// basic test router for retrieving names

router.get('/', (req, res) => {
    Names.getAll()
        .then(names => {
            res.status(201).json(names);
        })
        .catch(err => {
            res.status(400).json({ message: err })
        })
})

module.exports = router;