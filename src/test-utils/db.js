const db = require('../../database/db.js')
const cleaner = require('knex-cleaner')

const seedData = require('../../database/seedData.js')
const {users, properties, tenanthistory, workorders} = seedData

const reset = async () => {
  try {
    await cleaner.clean(db, {
      ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
    })
  } catch (err) {
    console.error(err)
  }
}

const destroyConn = async () => {
  await db.destroy()
}

const insertResourceIntoTable = tableName => resource =>
  db
    .from(tableName)
    .insert(resource)
    .returning('*')

// Users
const insertUsers = insertResourceIntoTable('users as u')
const getAllUsers = () => db.from('users as u')
// Properties
const getAllProperties = () => db.from('properties as p')
const insertProperties = insertResourceIntoTable('properties as p')
// Tenant History
const getAllTenantHistory = () => db.from('tenanthistory')
const insertTenantHistories = insertResourceIntoTable('tenanthistory')
// Workorders
const getAllWorkorders = () => db.from('workorders as w')
const insertWorkorders = insertResourceIntoTable('workorders as w')

const seedTables = async table => {
  // Insert into Tables
  switch (table) {
    case 'users':
      await insertUsers(users)
      break
    case 'properties':
      await insertProperties(properties)
      break
    case 'tenanthistory':
      await insertTenantHistories(tenanthistory)
      break
    case 'workorders':
      await insertWorkorders(workorders)
      break
    default:
      await insertUsers(users)
      await insertProperties(properties)
      await insertTenantHistories(tenanthistory)
      await insertWorkorders(workorders)
  }
}

const countResults = async table => {
  let results

  // Select Table
  switch (table) {
    case 'users':
      results = await getAllUsers()
      break
    case 'properties':
      results = await getAllProperties()
      break
    case 'tenanthistory':
      results = await getAllTenantHistory()
      break
    case 'workorders':
      results = await getAllWorkorders()
      break
    default:
      results = null
  }

  return results.length
}

module.exports = {
  reset,
  destroyConn,
  seedTables,
  getAllProperties,
  getAllUsers,
  getAllTenantHistory,
  getAllWorkorders,
  insertProperties,
  insertUsers,
  insertTenantHistories,
  insertWorkorders,
  countResults,
}
