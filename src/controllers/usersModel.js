const db = require("../../database/db-config");

module.exports = {
  getAll,
  findById
};

function getAll() {
  return db.from("users").select("*");
}

function findById(id) {
    return db("users").select('username', 'type').where({ id });
}