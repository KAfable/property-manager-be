const supertest = require('supertest')
const app = require('../../server')
const jwt = require('../../lib/jwt')

const db = require('../../../database/db')

const {Db, Models} = require('../../test-utils')

const request = supertest(app)

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

const defaultLandlord = Models.createLandlord()

const createToken = user => 'Bearer ' + jwt.signToken(user)

const defaultToken = createToken(defaultLandlord)

const testFixture = async () => {
  const users = await Db.insertUsers([
    defaultLandlord,
    Models.createLandlord({
      firstName: 'landlord2',
      email: 'landlord2@gmail.com',
    }),
  ])

  const properties = await Db.insertProperties([
    Models.createProperty(),
    Models.createProperty(),
  ])

  const tenants = await Db.insertUsers([
    Models.createTenant({
      firstName: 'tenant1',
      email: 'tenant1@gmail.com',
      residenceId: 1,
      landlordId: 1,
    }),
    Models.createTenant({
      firstName: 'tenant2',
      email: 'tenant2@gmail.com',
      residenceId: 2,
      landlordId: 2,
    }),
  ])

  return {
    landlord: users[0],
    landlord2: users[1],
    tenants,
    properties,
  }
}

describe('POST /api/tenants', () => {
  const endpoint = '/api/tenants'

  it('should return a status of 201 when successfully creating a tenant', async () => {
    await testFixture()

    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: 1,
      ...tenant,
    }

    const results = await request
      .post(endpoint)
      .set('Authorization', defaultToken)
      .send(input)

    expect(results.status).toBe(201)
  })

  it('should return the newly created user', async () => {
    let {landlord, properties} = await testFixture()
    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: properties[0].id,
      ...tenant,
    }

    const results = await request
      .post(endpoint)
      .set('Authorization', defaultToken)
      .send(input)

    expect(results.body).toEqual({...input, id: 5, landlordId: landlord.id})
  })

  it.skip('should validate the users input', () => {})

  it('should return a status of 401 if logged in user is not a landlord', async () => {
    const {properties} = await testFixture()
    const user2 = Models.createTenant({
      firstName: 'fake',
      email: 'tenantsrouter@gmail.com',
    })

    await Db.insertUsers(user2)

    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: properties[0].id,
      ...tenant,
    }

    const token = createToken(user2)

    const results = await request
      .post(endpoint)
      .set('Authorization', token)
      .send(input)

    expect(results.status).toBe(401)
    expect(results.body).toEqual({
      message: 'Only landlords are authorized to create tenants',
    })
  })

  it('should return 401 if the user is not authorized to associate the property with the user', async () => {
    const {properties} = await testFixture()
    const landlord2 = Models.createLandlord({
      firstName: 'fake',
      email: 'tenantsrouter@gmail.com',
    })

    await Db.insertUsers(landlord2)

    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: properties[0].id,
      ...tenant,
    }

    const token = createToken(landlord2)

    const results = await request
      .post(endpoint)
      .set('Authorization', token)
      .send(input)

    expect(results.status).toBe(401)
    expect(results.body).toEqual({
      message:
        'Not authorized to create association with another landlords property',
    })
  })

  it('should return a status of 401 if not authorized', async () => {
    const {properties} = await testFixture()
    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: properties[0].id,
      ...tenant,
    }

    const results = await request.post(endpoint).send(input)

    expect(results.status).toBe(401)
  })

  it('should change the status of the property from vacant to occupied when a tenant is added', async () => {
    const {properties} = await testFixture()

    const tenant = Models.createTenant({
      firstName: 'peter',
      lastName: 'peterton',
    })

    const input = {
      residenceId: properties[0].id,
      ...tenant,
    }

    await request
      .post(endpoint)
      .set('Authorization', defaultToken)
      .send(input)

    const [prop] = await db
      .from('properties')
      .select('status')
      .where({id: properties[0].id})

    expect(prop.status).toBe('occupied')
  })

  it.skip('should change the status of the property from occupied to vacant when all tenants are removed', () => {})
})

describe('GET /api/tenants', () => {
  const endpoint = '/api/tenants'

  it('should return a 401 if the user is not logged in', async () => {
    await testFixture()

    let res = await request.get(endpoint)

    expect(res.status).toBe(401)
  })

  it('should return a 401 if the user is a tenant', async () => {
    let {tenants} = await testFixture()

    const token = createToken(tenants[0])

    let res = await request.get(endpoint).set('Authorzation', token)

    expect(res.status).toBe(401)
  })

  it('should return a 200 if successful', async () => {
    await testFixture()

    const res = await request.get(endpoint).set('Authorization', defaultToken)

    expect(res.status).toBe(200)
  })

  it('should return an array of tenants', async () => {
    await testFixture()

    const res = await request.get(endpoint).set('Authorization', defaultToken)

    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should return of users that all have a landlordId that matches the landlords id', async () => {
    await testFixture()
    await Db.insertUsers([
      Models.createTenant({
        firstName: 'fred',
        email: 'anothertenant@gmail.com',
        landlordId: 1,
        residenceId: 1,
      }),
    ])

    const res = await request.get(endpoint).set('Authorization', defaultToken)

    const tenants = res.body

    tenants.forEach(tenant => {
      expect(tenant.landlordId).toBe(1)
    })
  })
})

describe('GET /api/tenants/:id', () => {
  const endpoint = '/api/tenants/'

  it('should return 401 if logged in', async () => {
    const res = await request.get(endpoint + 1)

    expect(res.status).toBe(401)
  })

  // This test is temporary as we don't have tenant accounts in place
  it('should return 401 if not logged in as a landlord', async () => {
    const {tenants} = await testFixture()

    const token = createToken(tenants[0])
    const res = await request.get(endpoint + 1).set('Authorization', token)

    expect(res.status).toBe(401)
  })

  it('should return 401 if the tenant does not belong to the landlord', async () => {
    const {landlord2} = await testFixture()

    const token = createToken(landlord2)

    const res = await request.get(endpoint + 3).set('Authorization', token)

    expect(res.status).toBe(401)
  })

  it('should return 200 when successful', async () => {
    const {landlord} = await testFixture()

    const token = createToken(landlord)

    const res = await request.get(endpoint + 3).set('Authorization', token)

    expect(res.status).toBe(200)
  })

  it('should return the desired tenant', async () => {
    const {landlord, tenants} = await testFixture()

    const token = createToken(landlord)

    const res = await request.get(endpoint + 3).set('Authorization', token)

    expect(res.body).toEqual(tenants[0])
  })
})

describe('PUT /api/tenants/:id', () => {
  const endpoint = '/api/tenants/3'

  it('should return 401 if user is not logged in', async () => {
    const input = {
      firstName: 'fred',
      lastname: 'frederson',
    }

    const res = await request.put(endpoint).send(input)

    expect(res.status).toBe(401)
  })

  it('should return 401 if user is not a landlord', async () => {
    const {tenants} = await testFixture()

    const input = {
      firstName: 'fred',
      lastname: 'frederson',
    }

    const token = createToken(tenants[1])

    const res = await request
      .put(endpoint)
      .send(input)
      .set('Authorization', token)

    expect(res.status).toBe(401)
  })

  it('should return 401 if the landlord is not authorized for the tenant', async () => {
    const {landlord2} = await testFixture()

    const input = {
      firstName: 'fred',
      lastName: 'frederson',
    }

    const token = createToken(landlord2)

    const res = await request
      .put(endpoint)
      .send(input)
      .set('Authorization', token)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'You are not authorized to edit that tenant',
    })
  })

  describe('should return 400 if input is invalid', () => {
    // TODO: Come back and delete this test when we add in the ability to change
    // a users email address
    it('should return 400 if the email key is present', async () => {
      const {landlord} = await testFixture()

      const token = createToken(landlord)

      const responses = await Promise.all([
        request
          .put(endpoint)
          .send({email: ''})
          .set('Authorization', token),
        request
          .put(endpoint)
          .send({email: null})
          .set('Authorization', token),
        request
          .put(endpoint)
          .send({email: 'someother@email.com'})
          .set('Authorization', token),
      ])

      const error = {
        errors: {
          email: 'The email field is not editable at this time',
        },
      }

      responses.forEach(response => {
        expect(response.status).toBe(400)
        expect(response.body).toEqual(error)
      })
    })
  })

  it('should return a 200 when successful', async () => {
    const {landlord} = await testFixture()
    const input = {firstName: 'fred', lastName: 'frederson'}

    const token = createToken(landlord)
    const res = await request
      .put(endpoint)
      .send(input)
      .set('Authorization', token)

    expect(res.status).toBe(200)
  })

  it('should return the tenant object when successful', async () => {
    const {landlord, tenants} = await testFixture()
    const input = {firstName: 'fred', lastName: 'frederson'}

    const token = createToken(landlord)

    const res = await request
      .put(endpoint)
      .send(input)
      .set('Authorization', token)

    expect(res.body).toEqual({...tenants[0], ...input})
  })
})
