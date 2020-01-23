// Workorder Controllers Test
const WOController = require('./workorders')
const {Db, Models, Express} = require('../../test-utils')

const testFixture = async () => {
  const [landlord] = await Db.insertUsers(Models.createLandlord())
  const [property] = await Db.insertProperties(Models.createProperty())

  const [tenant] = await Db.insertUsers(
    Models.createTenant({residenceId: property.id, landlordId: landlord.id}),
  )

  return {landlord, property, tenant}
}

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

describe('Workorder Controllers', () => {
  describe('readAllByUser', () => {
    describe('[user.type="landlord"]', () => {
      it('readAllByUser should return status 200', async () => {
        const {tenant, landlord, property} = await testFixture()
        const workOrders = await Db.insertWorkorders([
          Models.createWorkorder({
            createdBy: tenant.id,
            propertyId: tenant.residenceId,
          }),
          Models.createWorkorder({
            createdBy: landlord.id,
            propertyId: property.id,
          }),
        ])

        const req = Express.mockRequest({
          user: landlord,
        })

        const res = Express.mockResponse()

        await WOController.readAllByUser(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(workOrders)
      })
    })

    describe('[user.type="tenant"]', () => {
      it('readAllByUser should return status 200', async () => {
        const {tenant, landlord, property} = await testFixture()

        const workOrders = await Db.insertWorkorders([
          Models.createWorkorder({
            createdBy: tenant.id,
            propertyId: tenant.residenceId,
          }),
          Models.createWorkorder({
            createdBy: landlord.id,
            propertyId: property.id,
          }),
        ])

        const req = Express.mockRequest({
          user: tenant,
        })

        const res = Express.mockResponse()

        await WOController.readAllByUser(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(workOrders)
      })
    })
  })

  describe('create', () => {
    describe('[user.type="landlord"]', () => {
      it('create should send a status of 201 when successfully creating a workorder', async () => {
        const {landlord, property} = await testFixture()

        const input = Models.createWorkorder()

        const req = Express.mockRequest({
          body: input,
          user: landlord,
          property: {id: property.id},
        })
        const res = Express.mockResponse()

        await WOController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(expect.anything())
      })
    })

    describe('[user.type="tenant"]', () => {
      it('create should send a status of 201 when successfully creating a workorder', async () => {
        const {tenant} = await testFixture()

        const input = Models.createWorkorder({
          createdBy: tenant.id,
          propertyId: tenant.residenceId,
        })

        const req = Express.mockRequest({
          body: input,
          user: tenant,
          property: {id: tenant.residenceId},
        })
        const res = Express.mockResponse()

        await WOController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(expect.anything())
      })
    })
  })

  xdescribe('update', () => {
    it('update should send a status of 200 when successfully updating a workorder', async () => {
      const input = Models.createWorkorder()
      const req = Express.mockRequest({
        body: input,
        params: {
          id: 1,
        },
      })
      const res = Express.mockResponse()

      await WOController.updateById(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.anything())
      // expect(res.json).toHaveBeenCalledWith(expect.objectContaining({...input, "id": 1}))
    })
  })
})
