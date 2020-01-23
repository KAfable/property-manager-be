const faker = require('faker')

module.exports = {
  users: [
    {
      // master - 1
      firstName: 'Master',
      lastName: 'User',
      email: 'masterUser@gmail.com',
      phone: '1238675309',
      type: 'dev',
    },
    {
      // landlord - 2
      firstName: 'Landlord',
      lastName: 'User',
      email: 'landlord@gmail.com',
      phone: faker.phone.phoneNumber(),
      type: 'landlord',
    },
    {
      // tenant - 3
      firstName: 'Tenant',
      lastName: 'User',
      email: 'tenant@gmail.com',
      phone: faker.phone.phoneNumber(),
      type: 'tenant',
    },
    {
      // landlord - 4
      firstName: 'Second',
      lastName: 'Landlord',
      email: 'landlord2@gmail.com',
      phone: faker.phone.phoneNumber(),
      type: 'landlord',
    },
    {
      // tenant - 5
      firstName: 'Second',
      lastName: 'Tenant',
      email: 'tenant2@gmail.com',
      phone: faker.phone.phoneNumber(),
      type: 'tenant',
    },
  ],
  properties: [
    {
      // 1
      name: 'Name for the Property',
      street: '1 First St',
      city: 'Salt Lake City',
      state: 'Utah',
      zip: '84101',
      status: 'occupied',
      image: 'property.jpg',
      landlordId: 2,
    },
    {
      // 2
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 2,
    },
    {
      // 3
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 4,
    },
    {
      // 4
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 4,
    },
    {
      // 5
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 4,
    },
    {
      // 6
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 4,
    },
    {
      // 7
      name: faker.company.companyName(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      status: Math.round(Math.random()) === 0 ? 'vacant' : 'occupied',
      landlordId: 4,
    },
  ],
  tenanthistory: [
    {
      // id: 1, (auto)
      tenantId: 3,
      propertyId: 2,
      startDate: '01-01-2001',
      endDate: '12-31-2009',
    },
    {
      // id: 2, (auto)
      tenantId: 3,
      propertyId: 1,
      startDate: '01-01-2010',
      endDate: null,
    },
    {
      // id: 3, (auto)
      tenantId: 5,
      propertyId: 3,
      startDate: '01-01-2001',
      endDate: '04-30-2005',
    },
    {
      // id: 4, (auto)
      tenantId: 5,
      propertyId: 4,
      startDate: '05-01-2005',
      endDate: '12-31-2006',
    },
    {
      // id: 5, (auto)
      tenantId: 5,
      propertyId: 5,
      startDate: '01-01-2007',
      endDate: '12-31-2009',
    },
    {
      // id: 6, (auto)
      tenantId: 5,
      propertyId: 6,
      startDate: '01-01-2010',
      endDate: '12-31-2013',
    },
    {
      // id: 7, (auto)
      tenantId: 5,
      propertyId: 7,
      startDate: '01-01-2014',
      endDate: null,
    },
  ],
  workorders: [
    {
      title: 'Work Order Title',
      description: 'Description of the issue. For example: Tub is leaking.',
      type: 'plumbing',
      startDate: '10-31-2018',
      endDate: '11-05-2018',
      propertyId: 1,
      createdBy: 3,
    },
    {
      title: 'Short Description',
      description:
        'Description of the issue. For example: Lights not working in the living room.',
      type: 'electrical',
      startDate: '11-03-2019',
      endDate: null,
      propertyId: 1,
      createdBy: 3,
    },
    {
      title: 'Third Workorder',
      description: 'Description of the issue.',
      type: 'plumbing',
      startDate: '01-16-2020',
      endDate: null,
      propertyId: 7,
      createdBy: 5,
    },
  ],
}
