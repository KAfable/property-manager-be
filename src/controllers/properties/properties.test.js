const PropertyController = require('./properties')
const {Db, Models, Express} = require('../../test-utils')

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

describe('PropertyController.create', () => {
  describe('successes', () => {
    it('should send a status of 201 when successfully creating a property', async () => {
      await Db.insertUsers(Models.createUser())

      const input = Models.createProperty()
      const req = Express.mockRequest({
        body: input,
        user: {
          id: 1,
        },
      })
      const res = Express.mockResponse()

      await PropertyController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should return the newly created property', async () => {
      await Db.insertUsers(Models.createUser())

      const input = Models.createProperty()
      const req = Express.mockRequest({
        body: input,
        user: {
          id: 1,
        },
      })
      const res = Express.mockResponse()

      await PropertyController.create(req, res)

      expect(res.json).toHaveBeenCalledWith({...input, id: 1})
    })
  })

  describe('failures', () => {
    // This will only happen if for some reason the creation doesn't work
    it.skip('should return a 400 when...', () => {})
  })
})

describe('getAllByUser', () => {
  it('should return the list of properties associated with a landlord', async () => {
    const defaultUser = Models.createUser()
    await Db.insertUsers(defaultUser)

    const props = await Db.insertProperties([
      Models.createProperty({name: 'Name 1'}),
      Models.createProperty({name: 'Name 2'}),
      Models.createProperty({name: 'Name 3'}),
    ])

    const req = Express.mockRequest({
      user: {
        id: 1,
        type: 'landlord',
      },
    })

    const res = Express.mockResponse()

    await PropertyController.getAllByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(props)
  })

  it('should return the list of properties associated with a landlord', async () => {
    const [landlord] = await Db.insertUsers(Models.createLandlord())
    const properties = await Db.insertProperties(
      Models.createProperty({landlordId: landlord.id}),
    )
    const [tenant] = await Db.insertUsers(
      Models.createTenant({
        residenceId: properties[0].id,
        landlordId: landlord.id,
        email: 'tenant@gmail.com',
      }),
    )

    const req = Express.mockRequest({
      user: tenant,
    })

    const res = Express.mockResponse()

    await PropertyController.getAllByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(properties)
  })
})
