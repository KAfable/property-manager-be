const express = require('express')
const WOController = require('../../controllers/workorders/workorders.js')
const bearerAuth = require('../../lib/bearer-auth')
const requireAuth = require('../../lib/require-auth')

const router = express.Router()

const requirePropertyId = (req, res, next) => {
  if (!req.property.id) {
    return res.status(400).json({message: 'property id is required'})
  }

  next()
}

const putPropertyid = (req, _res, next) => {
  if (req.user.type === 'landlord') {
    req.property = {id: req.body.propertyId}
  } else {
    req.property = {id: req.user.residenceId}
  }

  next()
}

router.use(bearerAuth, requireAuth)

const validateById = async (req, res, next) => {
  const {id} = req.params

  try {
    const workorder = await WOController.readById(id)

    if (!workorder) {
      res.status(404).json({message: 'No workorder found with that id.'})
    } else {
      /* eslint-disable-next-line */
      req.workorder = workorder
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
  }
}

//#region - READ

// GET all workorders - based off the user who is logged in
router.get('/', WOController.readAllByUser)

// GET workorder by id
router.get('/:id', WOController.readById)

router.post('/', putPropertyid, requirePropertyId, WOController.create)

//#endregion
//#region - UPDATE

router.put('/:id', validateById, WOController.updateById)

//#endregion

//#region - DELETE

router.delete('/:id', validateById, WOController.remove)

//#endregion

module.exports = router
