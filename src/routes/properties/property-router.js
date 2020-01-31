const express = require('express')
const PropertyController = require('../../controllers/properties')
const Property = require('../../models/property')
const bearerAuth = require('../../lib/bearer-auth')
const requireAuth = require('../../lib/require-auth')
const {requireLandlord} = require('../../middleware')

const Properties = require('../../models/property')

const router = express.Router()

router.use(bearerAuth, requireAuth)

const checkPropertyExists = async (req, res, next) => {
  try {
    const property = await Property.getProperty(req.params.id)

    if (!property) {
      return res.sendStatus(404)
    }

    /* eslint-disable-next-line */
    req.property = property
    next()
  } catch (err) {
    console.error(err)

    return res.status(500).send('Internal Server Error')
  }
}

const requireAccess = (req, res, next) => {
  const {user, property} = req

  if (user.type === 'landlord' && user.id !== property.landlordId) {
    return res.sendStatus(401)
  }

  if (user.type === 'tenant' && user.residenceId !== property.id) {
    return res.sendStatus(401)
  }

  next()
}

const validateInput = getErrors => (req, res, next) => {
  const errors = getErrors(req.body)

  if (Object.keys(errors).length > 0) {
    res.status(400).json({errors})
  } else {
    next()
  }
}

const validatePropertyCreation = validateInput(input => {
  const {name} = input

  let errors = {}

  if (!name) {
    errors.name = 'Name field is required on Property'
  }

  return errors
})

const validatePropertyId = async (req, res, next) => {
  const {id} = req.params

  try {
    const property = await Properties.getProperty(id)

    if (!property) {
      res.status(404).json({message: 'No property found with that id.'})
    } else {
      /* eslint-disable-next-line */
      req.property = property
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
  }
}

// Must be placed after bearerAuth/requireAuth and validatePropertyId
const canModifyProperty = (propertyIdKey = 'id') => async (req, res, next) => {
  try {
    const property = await Properties.getProperty(req.params[propertyIdKey])

    if (!property) {
      return res.sendStatus(404)
    }

    if (req.user.id !== property.landlordId) {
      return res.sendStatus(401)
    }

    next()
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}

//#region - CREATE

// add Property and return results for a property by id inserted
router.post(
  '/',
  requireLandlord,
  validatePropertyCreation,
  PropertyController.create,
)

//#endregion - CREATE

//#region - READ

// GET all properties
router.get('/', PropertyController.getAllByUser)

// GET property by id
router.get(
  '/:id',
  checkPropertyExists,
  requireAccess,
  PropertyController.getById,
)

router.get(
  '/:id/tenants',
  requireLandlord,
  validatePropertyId,
  canModifyProperty('id'),
  PropertyController.getAllTenantsById,
)

// GET all properties for a specific user
router.get('/user/:email', async (req, res) => {
  const {email} = req.params

  try {
    const results = await Properties.getPropertiesByUser(email)
    res.json(results)
  } catch (err) {
    res.status(500).json({message: 'Failed to get results.'})
  }
})

//#endregion

//#region - UPDATE

// Update Property
router.put('/:id', PropertyController.updateById)

//#endregion

//#region - DELETE

// delete Event
router.delete('/:id', validatePropertyId, async (req, res) => {
  const {id} = req.params

  try {
    // check that property exists
    const {deleted} = await Properties.deleteProperty(id)

    if (deleted) {
      res.status(200).json(req.property)
    } else {
      res.status(400).json({message: 'Could not delete property.'})
    }
  } catch (err) {
    res.status(500).json({message: 'Failed to delete property.'})
  }
})

//#endregion

module.exports = router
