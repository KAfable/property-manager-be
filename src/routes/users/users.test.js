const supertest = require('supertest')
const app = require('../../server')
const {Db, Models} = require('../../test-utils')

const jwt = require('../../lib/jwt')

const createToken = user => 'Bearer ' + jwt.signToken(user)

const req = supertest(app)

beforeEach(async () => {
  await Db.reset()
})

afterAll(async () => {
  await Db.destroyConn()
})

const testFixture = () =>
  Db.insertUsers([
    Models.createLandlord(),
    Models.createTenant({email: 'tenantemail@gmail.com'}),
  ])

describe('GET /api/users/me', () => {
  const endpoint = '/api/users/me'

  it('should return a 401 if the user is not authorized', async () => {
    await testFixture()

    const result = await req.get(endpoint)

    expect(result.status).toBe(401)
  })

  it('should return a 200 if the user is authorized', async () => {
    let [, tenant] = await testFixture()

    const token = createToken(tenant)

    const res = await req.get(endpoint).set('Authorization', token)

    expect(res.status).toBe(200)
  })

  it('should return user info in the correct shape', async () => {
    let [landlord] = await testFixture()

    const token = createToken(landlord)

    const res = await req.get(endpoint).set('Authorization', token)

    expect(res.body).toEqual({
      firstName: landlord.firstName,
      lastName: landlord.lastName,
      type: 'landlord',
    })
  })
})

describe('PUT /api/users/me', () => {
  const endpoint = '/api/users/me'

  it('should return 401 if the user is not authroized', async () => {
    await testFixture()

    const update = {
      firstName: 'George',
    }

    const res = await req.put(endpoint).send(update)

    expect(res.status).toBe(401)
  })

  it('should return 200 if the user is succesful', async () => {
    let [landlord] = await testFixture()

    const update = {
      firstName: 'George',
    }

    const token = createToken(landlord)
    const res = await req
      .put(endpoint)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toBe(200)
  })

  it('should return the updated user', async () => {
    let [landlord] = await testFixture()

    const update = {
      firstName: 'George',
    }

    const {
      // eslint-disable-next-line
      residenceId: _dontNeed,
      // eslint-disable-next-line
      landlordId: _dontNeed2,
      ...rest
    } = landlord

    const token = createToken(landlord)

    const res = await req
      .put(endpoint)
      .set('Authorization', token)
      .send(update)

    expect(res.body).toEqual({...rest, ...update})
  })

  // CURRENTLY UNSUPPORTED
  it('should send a 400 if the user attempts to change their email', async () => {
    let [landlord] = await testFixture()

    const update = {
      email: 'georgey@gmail.com',
    }

    const token = createToken(landlord)
    const res = await req
      .put(endpoint)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toBe(400)
  })

  it('should send a 400 if the user attempts to send an empty string for an email', async () => {
    let [landlord] = await testFixture()

    const update = {
      email: '',
    }

    const token = createToken(landlord)
    const res = await req
      .put(endpoint)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toBe(400)
  })

  it('should send a 400 if the user attempts to send an null for an email', async () => {
    let [landlord] = await testFixture()

    const update = {
      email: null,
    }

    const token = createToken(landlord)
    const res = await req
      .put(endpoint)
      .set('Authorization', token)
      .send(update)

    expect(res.status).toBe(400)
  })
})
