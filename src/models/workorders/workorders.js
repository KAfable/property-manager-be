const Property = require('../property')
const User = require('../user')
// Work Order Models
const db = require('../../../database/db')
const {omit, map, pipeP} = require('ramda')

const table = 'workorders as w'

module.exports = {
  // Create
  add,
  // Read
  get,
  getBy,
  getById,
  getByLandlordId,
  getAllByPropertyId,
  // Update
  update,
  // Delete
  remove,
}

async function getDetails(workorder) {
  try {
    const property = await Property.getProperty(workorder.propertyId)
    const user = await User.findById(workorder.createdBy, '*')
    const intermediate = omit(['propertyId', 'createdBy'], workorder)

    return {...intermediate, property, createdBy: user}
  } catch (err) {
    console.error(err)
  }
}

const getAllDetails = pipeP(map(getDetails))

//#region - CREATE

async function add(input, propertyId, userId) {
  const workorders = await db(table)
    .returning('*')
    .insert({...input, propertyId: propertyId, createdBy: userId})

  const [workorder] = await getAllDetails(workorders)

  return workorder || null
}

//#endregion

//#region - READ

async function get() {
  const results = await db.from(table).select('*')

  return results || null
}

async function getById(id) {
  const results = await db
    .from(table)
    .select('*')
    .where({id})

  const [workorder] = await getAllDetails(results)

  return workorder || null
}

function getAllByPropertyId(propertyId) {
  return getBy({propertyId})
}

async function getByLandlordId(id) {
  const results = await db
    .from(table)
    .join('properties as p', 'p.id', 'w.propertyId')
    .join('users as u', 'u.id', 'p.landlordId')
    .select('w.*')
    .where({'p.landlordId': id})

  return results || null
}

async function getBy(query) {
  const results = await db
    .from(table)
    .select('*')
    .where(query)

  return results || null
}

//#endregion

//#region - Update

async function update(changes, id) {
  const updates = await db
    .from(table)
    .update(changes)
    .where({id})
    .returning('*')

  const [workorder] = await Promise.all(getAllDetails(updates))

  return updates ? {updated: true, results: workorder} : {updated: false}
}

//#endregion

//#region - Delete

async function remove(id) {
  const results = await db(table)
    .where({id})
    .del()

  return results === 1 ? {deleted: true} : {deleted: false}
}

//#endregion
