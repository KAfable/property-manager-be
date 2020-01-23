const {workorders} = require('../seedData.js')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.from('workorders').insert(workorders)
}
