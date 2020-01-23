const jwt = require('../lib/jwt')
const bearerAuth = require('./bearer-auth')
const {Db, Models, Express} = require('../test-utils')

const defaultUser = Models.createUser()

const createToken = user => 'Bearer ' + jwt.signToken(user)

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

describe('bearerAuth', () => {
  it('should call next when the token is valid', async () => {
    // arrange
    await Db.insertUsers(defaultUser)
    const req = Express.mockRequest({
      headers: {authorization: createToken(defaultUser)},
    })
    const res = Express.mockResponse()
    const next = jest.fn()

    // act
    await bearerAuth(req, res, next)

    // assert
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should set the correct user on `req.user`', async () => {
    const [insertedUser] = await Db.insertUsers(defaultUser)
    const req = Express.mockRequest({
      headers: {authorization: createToken(defaultUser)},
    })
    const res = Express.mockResponse()
    const next = jest.fn()

    // eslint-disable-next-line
    const {residenceId, landlordId, ...rest} = insertedUser

    // act
    await bearerAuth(req, res, next)

    // assert
    expect(req.user).toEqual(rest)
  })

  // Because we have a modular auth system a different piece of middleware is
  // responsible for checking if the user is authorized. This allows the bearer
  // auth middleware to only be concerned with verifying the validity of the
  // token when Bearer is used
  it("should call next when Bearer auth isn't used", async () => {
    const req = Express.mockRequest({
      headers: {authorization: 'Basic 1234'},
    })
    const res = Express.mockResponse()
    const next = jest.fn()

    await bearerAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("should send a 401 when the token isn't valid", async () => {
    const req = Express.mockRequest()
    const res = Express.mockResponse()
    const next = jest.fn()

    await bearerAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith({error: 'You are not authorized'})
  })
})
