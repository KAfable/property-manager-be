const db = require('../../../database/db')

const table = 'users as u'

const landlordReturning = [
  'id',
  'firstName',
  'lastName',
  'type',
  'phone',
  'email',
]

const tenantReturning = '*'

async function create(input, returning = landlordReturning) {
  const [user] = await db
    .from(table)
    .insert(input)
    .returning(returning)

  return user || null
}

function createTenant(input) {
  return create(input, '*')
}

async function findByEmail(email, type) {
  const [user] = await db
    .from(table)
    .select(type === 'tenant' ? tenantReturning : landlordReturning)
    .where({email})

  return user || null
}

async function findById(id, returning = landlordReturning) {
  const [user] = await db
    .from(table)
    .select(returning)
    .where({id})

  return user || null
}

function findTenantById(id) {
  return findById(id, '*')
}

async function updateByEmail(email, update, returning = landlordReturning) {
  const [user] = await db
    .from(table)
    .update(update)
    .where({email})
    .returning(returning)

  return user ? {updated: true, user} : {updated: false}
}

function getAllTenantsByPropertyId(id) {
  return db
    .from(table)
    .select('*')
    .where({residenceId: id})
}

function getAllTenantsByLandlordId(id) {
  return db
    .from(table)
    .select('*')
    .where({landlordId: id})
}

async function canAccessTenant(landlordId, tenantId) {
  const tenant = await findById(tenantId, 'landlordId')

  return tenant.landlordId === landlordId
}

async function updateTenantById(id, update) {
  const [tenant] = await db
    .from(table)
    .update(update)
    .where({id})
    .returning('*')

  return tenant ? {updated: true, user: tenant} : {updated: false}
}

module.exports = {
  canAccessTenant,
  create,
  createTenant,
  findByEmail,
  findById,
  findTenantById,
  updateByEmail,
  updateTenantById,
  getAllTenantsByPropertyId,
  getAllTenantsByLandlordId,
}
