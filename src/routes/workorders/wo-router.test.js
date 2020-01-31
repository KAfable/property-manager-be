const supertest = require('supertest')
const jwt = require('../../lib/jwt')
const app = require('../../server.js') // Link to your server file
const {Db, Models} = require('../../test-utils')

const {omit} = require('ramda')

const request = supertest(app)

//#region setup variables

const routeAPI = '/api/workorders'

//#endregion

const testFixture = async () => {
  const [landlord] = await Db.insertUsers(Models.createLandlord())
  const [property] = await Db.insertProperties(
    Models.createProperty({landlordId: landlord.id}),
  )

  const [tenant] = await Db.insertUsers(
    Models.createTenant({
      residenceId: property.id,
      landlordId: landlord.id,
      email: 'tenant@gmail.com',
    }),
  )

  return {landlord, property, tenant}
}

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

describe('Workorder Routes', () => {
  //#region - CREATE
  describe("post: '" + routeAPI + "' endpoint", () => {
    it('should return a 401 if user is not authenticated', async () => {
      const results = await request.post(routeAPI).send({})

      expect(results.status).toBe(401)
    })

    it('should return 201 status when successful', async () => {
      const {tenant, property} = await testFixture()

      const newEntry = Models.createWorkorder()

      // call function
      const results = await request
        .post(routeAPI)
        .send(newEntry)
        .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

      // expected results
      expect(results.status).toBe(201)
      expect(results.body).toEqual({
        id: 1,
        createdBy: tenant,
        property: property,
        ...omit(['propertyId'], newEntry),
        startDate: new Date(newEntry.startDate).toISOString(),
      })
    })

    it('should return 201 when landlord successfully creates workorder', async () => {
      const {landlord, property} = await testFixture()

      const newEntry = Models.createWorkorder({propertyId: property.id})

      const results = await request
        .post(routeAPI)
        .send(newEntry)
        .set('Authorization', 'Bearer ' + jwt.signToken(landlord))

      // expected results
      expect(results.status).toBe(201)
      expect(results.body).toEqual({
        id: 1,
        createdBy: landlord,
        property: property,
        ...omit(['propertyId'], newEntry),
        startDate: new Date(newEntry.startDate).toISOString(),
      })
    })
  })

  //#endregion - CREATE

  //#region - READ
  describe("get: '" + routeAPI + "' endpoint", () => {
    it('should return a 401 when the user is not authorized', async () => {
      const {error} = await request.get(routeAPI)

      expect(error.status).toBe(401)
    })

    it('should return 200 status', async () => {
      const {tenant} = await testFixture()

      const results = await request
        .get(routeAPI)
        .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

      expect(results.status).toBe(200)
    })

    describe('[user.type = "landlord"]', () => {
      // TODO: Come back and make this less ugly
      it('should return all workorders associated with all properties', async () => {
        const {landlord, tenant, property: prop1} = await testFixture()
        const [prop2, prop3] = await Db.insertProperties([
          Models.createProperty(),
          Models.createProperty(),
        ])

        const workOrders = await Db.insertWorkorders([
          Models.createWorkorder({
            createdBy: landlord.id,
            propertyId: prop1.id,
          }),
          Models.createWorkorder({createdBy: tenant.id, propertyId: prop2.id}),
          Models.createWorkorder({
            createdBy: landlord.id,
            propertyId: prop3.id,
          }),
        ])

        const res = await request
          .get(routeAPI)
          .set('Authorization', 'Bearer ' + jwt.signToken(landlord))

        expect(res.status).toBe(200)
        expect(res.body).toEqual(
          workOrders.map(wo => ({
            ...wo,
            startDate: new Date(wo.startDate).toISOString(),
          })),
        )
        expect(res.body.length).toBe(workOrders.length)
      })
    })

    describe('[user.type = "tenant"]', () => {
      it('should return all work', async () => {
        const {tenant, property} = await testFixture()
        await Db.insertWorkorders([
          Models.createWorkorder({
            createdBy: tenant.id,
            propertyId: property.id,
          }),
          Models.createWorkorder({
            createdBy: tenant.id,
            propertyId: property.id,
          }),
        ])

        const results = await request
          .get(routeAPI)
          .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

        expect(results.body.length).toBe(2)
      })
    })
  })

  describe("get: '" + routeAPI + "/:id' endpoint", () => {
    describe('[user.type="landlord"]', () => {
      it('should return a 401 when the user does not have permission to access the work order', async (id = 1) => {
        const {landlord, tenant} = await testFixture()
        const [property] = await Db.insertProperties(
          Models.createProperty({landlordId: landlord.id}),
        )
        const workorder = await Models.createWorkorder({
          createdBy: landlord.id,
          propertyId: property.id,
        })
        await Db.insertWorkorders(workorder)

        const res = await request
          .get(routeAPI + '/' + id)
          .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

        expect(res.status).toBe(401)
        expect(res.body).toBe(
          'You are not authorized to access that work order',
        )
      })
    })

    describe('[user.type="tenant"]', () => {
      it('should return a 401 when the user does not have permission to access the work order', async (id = 1) => {
        const {landlord, property} = await testFixture()
        const [property2] = await Db.insertProperties(
          Models.createProperty({landlordId: landlord.id}),
        )

        const [secondTenant] = await Db.insertUsers(
          Models.createTenant({
            residenceId: property2.id,
            email: 'testtenant@gmail.com',
          }),
        )

        const workorder = await Models.createWorkorder({
          createdBy: landlord.id,
          propertyId: property.id,
        })

        await Db.insertWorkorders(workorder)

        const res = await request
          .get(routeAPI + '/' + id)
          .set('Authorization', 'Bearer ' + jwt.signToken(secondTenant))

        expect(res.status).toBe(401)
        expect(res.body).toBe(
          'You are not authorized to access that work order',
        )
      })
    })

    it('should return a 401 when the user is not logged in', async (id = 1) => {
      const {error} = await request.get(routeAPI + '/' + id)

      expect(error.status).toBe(401)
    })

    it("should return a 404 when the work order doesn't exist", async (id = 1) => {
      const {tenant} = await testFixture()

      const results = await request
        .get(routeAPI + '/' + id)
        .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

      expect(results.status).toBe(404)
    })

    it('should return 200 status', async (id = 1) => {
      const {tenant, property} = await testFixture()

      await Db.insertWorkorders([
        Models.createWorkorder({
          createdBy: tenant.id,
          propertyId: property.id,
        }),
      ])

      const results = await request
        .get(routeAPI + '/' + id)
        .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

      expect(results.status).toBe(200)
    })

    it('should return an object that matches example', async (id = 1) => {
      const {tenant, property} = await testFixture()

      const [workorder] = await Db.insertWorkorders([
        Models.createWorkorder({createdBy: tenant.id, propertyId: property.id}),
      ])

      const results = await request
        .get(routeAPI + '/' + id)
        .set('Authorization', 'Bearer ' + jwt.signToken(tenant))

      expect(results.body).toEqual({
        property,
        createdBy: tenant,
        ...omit(['propertyId', 'createdBy'], workorder),
        startDate: new Date(workorder.startDate).toISOString(),
      })
    })
  })
  //#endregion
})
