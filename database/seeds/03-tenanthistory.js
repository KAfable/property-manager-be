const {tenanthistory} = require('../seedData.js')

exports.seed = function(knex) {
  // console.log(tenanthistory)
  return knex.from('tenanthistory').insert(tenanthistory)
}
