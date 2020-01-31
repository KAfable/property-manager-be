const supertest = require('supertest')
const jwt = require('../../lib/jwt')
const app = require('../../server.js') // Link to your server file
const {Db, Models} = require('../../test-utils')

const request = supertest(app)

const defaultLandlord = Models.createUser()
const newProperty = Models.createProperty()

const createToken = user => 'Bearer ' + jwt.signToken(user)

beforeEach(async () => {
  await Db.reset()
  await Db.insertUsers(defaultLandlord)
})

afterAll(async () => {
  await Db.destroyConn()
})

const testFixture = async () => {
  const users = await Db.insertUsers([
    defaultLandlord,
    Models.createLandlord({
      firstName: 'landlord2',
      email: 'somelandlord@gmail.com',
    }),
  ])
  const properties = await Db.insertProperties([
    Models.createProperty(),
    Models.createProperty({landlordId: 2}),
  ])

  return [users, properties]
}

const tenant1 = Models.createTenant({
  residenceId: 1,
  landlordId: 1,
  firstName: 'tenant1',
  email: 'tenant1@gmail.com',
})

const tenant2 = Models.createTenant({
  residenceId: 1,
  landlordId: 1,
  firstName: 'tenant2',
  email: 'tenant2@gmail.com',
})

const tenantsFixture = async () => {
  const [landlords, properties] = await testFixture()

  const tenants = await Db.insertUsers([tenant1, tenant2])

  return {
    landlords,
    tenants,
    properties,
  }
}

describe('Properties Routes', () => {
  //#region - CREATE
  describe("post: '/api/properties/' endpoint", () => {
    it('should return a 401 if user is not authenticated', async () => {
      const results = await request.post('/api/properties/').send(newProperty)

      expect(results.status).toBe(401)
    })
    it('should return 201 status when successful', async () => {
      // call function

      const token = createToken(defaultLandlord)

      const results = await request
        .post('/api/properties/')
        .send(newProperty)
        .set('Authorization', token)

      // expected results
      expect(results.status).toBe(201)
      expect(results.body).toEqual({...newProperty, id: 1})
    })
  })

  //#endregion - CREATE

  //#region - READ
  describe("get: '/api/properties/' endpoint", () => {
    it('should return a 401 when the user is not authorized', async () => {
      const {error} = await request.get('/api/properties/')

      expect(error.status).toBe(401)
    })

    it('should return 200 status', async () => {
      const token = createToken(defaultLandlord)

      const results = await request
        .get('/api/properties/')
        .set('Authorization', token)

      expect(results.status).toBe(200)
      expect(results.body.length).toBe(0)
    })

    it('should return a length of 2', async () => {
      const token = createToken(defaultLandlord)

      await Db.insertProperties([
        Models.createProperty(),
        Models.createProperty(),
      ])

      const results = await request
        .get('/api/properties/')
        .set('Authorization', token)

      expect(results.body.length).toBe(2)
    })

    describe('[user.type="tenant"]', () => {
      it('should return 200 status', async () => {
        const [landlord] = await Db.insertUsers(Models.createLandlord())
        const properties = await Db.insertProperties(
          Models.createProperty({landlordId: landlord.id}),
        )
        const [property] = properties
        const [tenant] = await Db.insertUsers(
          Models.createTenant({
            landlordId: landlord.id,
            residenceId: property.id,
            email: 'tenant@gmail.com',
          }),
        )

        const token = createToken(tenant)

        const res = await request
          .get('/api/properties')
          .set('Authorization', token)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(properties)
      })
    })

    // describe('[user.type="landlord"]', () => {

    // })
  })

  describe("get: '/api/properties/:id' endpoint", () => {
    describe('[user.type="tenant"]', () => {
      it('should return 200 status', async () => {
        const [landlord] = await Db.insertUsers([Models.createLandlord()])
        const [property] = await Db.insertProperties([
          Models.createProperty({landlordId: landlord.id}),
        ])

        const [tenant] = await Db.insertUsers(
          Models.createTenant({
            landlordId: landlord.id,
            residenceId: property.id,
            email: 'tenant@gmail.com',
          }),
        )

        const token = createToken(tenant)

        const results = await request
          .get('/api/properties/1')
          .set('Authorization', token)

        expect(results.status).toBe(200)
        expect(results.body).toEqual(property)
      })
    })
    it('should return 200 status', async () => {
      const token = createToken(defaultLandlord)

      await Db.insertProperties([
        Models.createProperty(),
        Models.createProperty(),
      ])

      const results = await request
        .get('/api/properties/1')
        .set('Authorization', token)

      expect(results.status).toBe(200)
    })

    it('should return an object that matches example', async () => {
      const token = createToken(defaultLandlord)

      const [property] = await Db.insertProperties([Models.createProperty()])

      const results = await request
        .get('/api/properties/1')
        .set('Authorization', token)
      const response = results.body

      expect(response).toEqual(property)
    })
  })

  describe("get: '/api/properties/user/:email' endpoint", () => {
    it.skip('should return 200 status', async () => {
      const results = await request.get(
        '/api/properties/user/"landlord@email.com"',
      )
      expect(results.status).toBe(200)
    })

    it.skip('should return array', async () => {
      const results = await request.get('/api/properties/user/' + '')
      const response = await results.body

      expect(Array.isArray(response)).toBe(true)
    })

    it.skip('should return a length of 2', async () => {
      const results = await request.get('/api/properties/user/' + '')
      const response = await results.body

      expect(response).toHaveLength(2)
    })

    it.skip('should return objects with the users email landlord@email.com', async () => {
      const results = await request.get('/api/properties/user/' + '')
      const response = await results.body

      expect(response[0].email).toBe('landlord@email.com')
      expect(response[1].email).toBe('landlord@email.com')
    })

    it.skip('if user does not exist should return empty array', async () => {
      const results = await request.get('/api/properties/user/test')
      const response = await results.body

      expect(response).toEqual([])
    })
  })

  // #endregion

  //#region - UPDATE
  describe("put: '/api/properties/' endpoint", () => {
    it('should return 200 status', async () => {
      // call function
      const token = createToken(defaultLandlord)
      const prop2 = Models.createProperty({name: 'some funky name'})
      const input = {name: 'a new funky name'}

      const [, secondProp] = await Db.insertProperties([
        Models.createProperty(),
        prop2,
      ])

      const results = await request
        .put('/api/properties/2')
        .set('Authorization', token)
        .send(input)
      // expected results
      expect(results.status).toBe(200)
      expect(results.body).toEqual({...secondProp, ...input})
    })

    it('should fail if id is not valid with message: Could not find property with given id', async () => {
      const token = createToken(defaultLandlord)

      // call function
      const results = await request
        .put('/api/properties/5')
        .set('Authorization', token)
        .send({name: 'Sample Property Updated'})

      // expected results
      expect(results.status).toBe(404)
      expect(results.body.message).toEqual('No property found with that id')
    })
  })

  //#endregion - UPDATE

  //#region - DELETE
  describe("delete: '/api/properties/' endpoint", () => {
    it('should return 200 status', async () => {
      const token = createToken(defaultLandlord)

      await Db.insertProperties([
        Models.createProperty(),
        Models.createProperty(),
        Models.createProperty(),
      ])

      // call function
      const results = await request
        .delete('/api/properties/2')
        .set('Authorization', token)
      // expected results
      expect(results.status).toBe(200)
    })

    it('should return property to be deleted', async () => {
      const token = createToken(defaultLandlord)
      const prop2 = Models.createProperty({name: 'Second Prop'})

      await Db.insertProperties([Models.createProperty(), prop2])

      const results = await request
        .delete('/api/properties/2')
        .set('Authorization', token)
      // expected results
      expect(results.body).toEqual({...prop2, id: 2})
    })

    it('should fail if id is not valid with status 404', async () => {
      const token = createToken(defaultLandlord)
      // call function
      const results = await request
        .delete('/api/properties/5')
        .set('Authorization', token)
      // expected results
      expect(results.status).toBe(404)
      expect(results.body).toEqual({
        message: 'No property found with that id.',
      })
    })
  })

  //#endregion - DELETE
})

describe('GET /api/properties/:id/tenants', () => {
  it('should return 401 when not logged in', async () => {
    await tenantsFixture()
    const results = await request.get('/api/properties/1/tenants')

    expect(results.status).toBe(401)
  })

  it('should send a 401 when the landlord is not authorized to view the property', async () => {
    await tenantsFixture()
    const token = createToken(defaultLandlord)

    const results = await request
      .get('/api/properties/2/tenants')
      .set('Authorization', token)

    expect(results.status).toBe(401)
  })

  it('should send 404 when no property exists with that id', async () => {
    await tenantsFixture()

    const token = createToken(defaultLandlord)

    const results = await request
      .get('/api/properties/3/tenants')
      .set('Authorization', token)

    expect(results.status).toBe(404)
  })

  it('should send a 200 when successful', async () => {
    await tenantsFixture()

    const token = createToken(defaultLandlord)

    const results = await request
      .get('/api/properties/1/tenants')
      .set('Authorization', token)

    expect(results.status).toBe(200)
  })

  it('should return an array of tenants when successful', async () => {
    const {tenants} = await tenantsFixture()

    const token = createToken(defaultLandlord)

    const results = await request
      .get('/api/properties/1/tenants')
      .set('Authorization', token)

    expect(results.body).toEqual(tenants)
  })
})
