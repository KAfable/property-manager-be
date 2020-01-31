const Property = require('../../models/property')
const User = require('../../models/user')

const loadProperty = async (req, res, next) => {
  try {
    const property = await Property.getProperty(req.property.id)

    if (property) {
      next()
    } else {
      res.status(404).json({message: 'Property not found'})
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal server error')
  }
}

const create = async (req, res) => {
  const input = req.body

  try {
    const property = await Property.addProperty(input, req.user.id)
    if (property) {
      res.status(201).json(property)
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const getAllByUser = async (req, res) => {
  try {
    if (req.user.type === 'tenant') {
      const property = await Property.getProperty(req.user.residenceId)

      res.status(200).json([property])
    } else if (req.user.type === 'landlord') {
      const properties = await Property.getPropertiesByUser(req.user.id)

      res.status(200).json(properties)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const getById = async (req, res) => {
  const {id} = req.params

  try {
    const property = await Property.getProperty(id)

    if (property) {
      // if (req.user.type === 'landlord' && req.user.id !== property.landlordId) {
      //   res.sendStatus(401)
      //   return
      // }

      // if (req.user.type === 'tenant' && req.user.residenceId !== property.id) {
      //   res.sendStatus(401)
      //   return
      // }

      res.status(200).json(property)
    } else {
      res.status(404).json({error: 'No property found with that id'})
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const updateById = async (req, res) => {
  const {id} = req.params
  const changes = req.body

  try {
    const results = await Property.updateProperty(changes, id)

    if (results.updated) {
      res.status(200).json(results.property)
    } else {
      res.status(404).json({message: 'No property found with that id'})
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const getAllTenantsById = async (req, res) => {
  const {id} = req.property

  try {
    const tenants = await User.getAllTenantsByPropertyId(id)

    if (tenants) {
      return res.status(200).json(tenants)
    } else {
      return res.sendStatus(500)
    }
  } catch (err) {
    console.error(err)

    return res.sendStatus(500)
  }
}

module.exports = {
  create,
  getAllByUser,
  getById,
  getAllTenantsById,
  updateById,
  loadProperty,
}
