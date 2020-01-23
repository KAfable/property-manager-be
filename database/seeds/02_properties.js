// const {seedProperties} = require('../../src/lib/db-helpers')
const {properties} = require('../seedData.js')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  // return knex.from('properties').insert(seedProperties) -- mine is breaking

  return knex.from('properties').insert(properties)
}
