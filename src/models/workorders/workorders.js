// Work Order Models
const db = require('../../../database/db')

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

//#region - CREATE

async function add(input, propertyId, userId) {
  const results = await db(table)
    .returning('id')
    .insert({...input, propertyId: propertyId, createdBy: userId})

  return getById(results[0])
}

//#endregion

//#region - READ

async function get() {
  const results = await db.from(table).select('*')

  return results || null
}

async function getById(id) {
  const [results] = await db
    .from(table)
    .select('*')
    .where({id})

  return results || null
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
  const [results] = await db
    .from(table)
    .update(changes)
    .where({id})
    .returning('*')

  return results ? {updated: true, results} : {updated: false}
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
