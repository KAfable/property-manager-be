// Workorder Controllers
const Workorders = require('../../models/workorders')

const create = async (req, res) => {
  const input = req.body

  try {
    const results = await Workorders.add(input, req.property.id, req.user.id)
    if (results) {
      res.status(201).json(results)
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const readAllByUser = async (req, res) => {
  try {
    if (req.user.type === 'tenant') {
      const workOrders = await Workorders.getAllByPropertyId(
        req.user.residenceId,
      )

      res.status(200).json(workOrders)
    } else {
      const workOrders = await Workorders.getByLandlordId(req.user.id)
      res.status(200).json(workOrders)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const readById = async (req, res) => {
  const {id} = req.params

  try {
    const results = await Workorders.getById(id)

    if (results) {
      res.status(200).json(results)
    } else {
      res.status(404).json({error: 'No workorder found with that id'})
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
    const updateResults = await Workorders.update(changes, id)

    if (updateResults.updated) {
      res.status(200).json(updateResults.results)
    } else {
      res.status(404).json({message: 'No workorder found with that id'})
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const remove = async (req, res) => {
  const {id} = req.params

  try {
    // check that property exists
    const {deleted} = await Workorders.remove(id)

    if (deleted) {
      res.status(200).json(req.property)
    } else {
      res.status(400).json({message: 'Could not delete workorder.'})
    }
  } catch (err) {
    res.status(500).json({message: 'Failed to delete workorder.'})
  }
}

module.exports = {
  create,
  readAllByUser,
  readById,
  updateById,
  remove,
}
