const format = require('date-fns/format')

const formatStandard = date => (date ? format(date, 'MM/dd/yyyy') : null)

const createUser = input => {
  return {
    firstName: 'Matt',
    lastName: 'Hagner',
    email: 'test@gmail.com',
    type: 'landlord',
    phone: '1238675309',
    ...input,
  }
}

const createLandlord = input => createUser({type: 'landlord', ...input})
const createTenant = input => createUser({type: 'tenant', ...input})

const createProperty = input => {
  return {
    name: 'First Property',
    street: '123 Easy Street',
    city: 'Minneapolis',
    state: 'MN',
    zip: '55330',
    image: 'newProperty.jpg',
    status: 'vacant',
    landlordId: 1,
    ...input,
  }
}

const createTenantHistory = ({startDate, endDate, ...input} = {}) => {
  const date = new Date()

  return {
    tenantId: 1,
    propertyId: 1,
    startDate: startDate ? formatStandard(startDate) : formatStandard(date),
    endDate: endDate ? formatStandard(endDate) : null,
    ...input,
  }
}

const createWorkorder = ({startDate, endDate, propertyId, createdBy, ...input} = {}) => {
  const date = new Date()
  
  return {
    "title": "New Work order",
    "description": "Description of the issue.",
    "type": "electrical",
    "startDate": startDate ? formatStandard(startDate) : formatStandard(date),
    "endDate": endDate ? formatStandard(endDate) : null,
    "propertyId": propertyId ? propertyId : 1,
    "createdBy": createdBy ? createdBy : 3,
    ...input,
  }
}

module.exports = {
  createLandlord,
  createUser,
  createProperty,
  createTenant,
  createTenantHistory,
  createWorkorder,
}
