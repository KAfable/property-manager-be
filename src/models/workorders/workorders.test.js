const {Db, Models} = require('../../test-utils')
const Workorders = require('./workorders.js')

beforeEach(async () => {
  await Db.reset()
  await Db.seedTables('users')
  await Db.seedTables('properties')
  await Db.seedTables('workorders')
})

afterAll(async () => {
  await Db.destroyConn()
})

const defaultWorkorder = Models.createWorkorder()

describe('Workorder Model', () => {
  describe('function add', () => {
    it('Should return result of an object', async () => {
      // call function
      const results = await Workorders.add(defaultWorkorder, 1, 2)

      // expected results
      expect(typeof results).toBe('object')
    })

    it('Should return result that matches expected object', async () => {
      // call function
      const results = await Workorders.add(defaultWorkorder, 1, 2)

      // expected results
      expect(results.title).toBe('New Work order')
      expect(results.property.id).toBe(1)
      expect(results.createdBy.id).toBe(2)
    })

    it('Count of all Workorders should increase by 1', async () => {
      // count before
      const dbBefore = await Db.countResults('workorders')

      // call function
      await Workorders.add(defaultWorkorder, 1, 2)

      // count after
      const dbAfter = await Db.countResults('workorders')

      // expected results
      expect(dbAfter - dbBefore).toEqual(1)
    })
  })

  describe('function get', () => {
    it('Should return an array', async () => {
      // call function
      const results = await Workorders.get()

      // expected results
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('function getById(id)', () => {
    it('Should return an object', async () => {
      // Expected Input
      const id = 1

      // call function
      const results = await Workorders.getById(id)

      // expected results
      expect(typeof results).toBe('object')
    })

    it('Should return title: "Short Description" for the workorder with id=2', async () => {
      // Expected Input
      const id = 2

      // call function
      const results = await Workorders.getById(id)

      // expected results
      expect(results.title).toBe('Short Description')
    })
  })

  describe('function getBy(query)', () => {
    it('Should return an Array', async () => {
      // Expected Input
      const query = {createdBy: 2}

      // call function
      const results = await Workorders.getBy(query)

      // expected results
      expect(Array.isArray(results)).toBe(true)
    })

    it('Should return 2 workorders for property with id 1', async () => {
      // Expected Input
      const query = {propertyId: 1}

      // call function
      const results = await Workorders.getBy(query)

      // expected results
      expect(results.length).toEqual(2)
    })
  })

  describe('function update', () => {
    it('Should update title to: Updated Workorder', async () => {
      // call function

      const id = 2
      const update = {title: 'Updated Workorder'}

      const {updated, results} = await Workorders.update(update, id)

      // expected results
      expect(updated).toBe(true)
      expect(results.title).toBe('Updated Workorder')
    })
  })

  describe('function remove', () => {
    it('Should return { deleted: true } when successfully deleted', async () => {
      // call function
      const {deleted} = await Workorders.remove(2)
      // expected results
      expect(deleted).toBe(true)
    })

    it('Workorder by id Should return undefined after delete', async () => {
      const id = 2
      // call function
      await Workorders.remove(id)
      // check database for the property by id
      const results = await Workorders.getById(id)
      // expected results
      expect(results).toBe(null)
    })

    it('Count of all workorders Should decrease by 1', async () => {
      // count before
      const dbBefore = await Db.countResults('workorders')

      // call function
      await Workorders.remove(2)

      // count after
      const dbAfter = await Db.countResults('workorders')

      // expected results
      expect(dbBefore - dbAfter).toEqual(1)
    })
  })
})
