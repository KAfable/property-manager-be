const cleaner = require("knex-cleaner");
const Users = require("./usersModel");
const db = require("../../database/db-config");

beforeEach(async () => {
  // This wipes the entire test database clean before each test
  await cleaner.clean(db, {
    ignoreTables: ["knex_migrations", "knex_migrations_lock"]
  });
});

afterAll(async () => {
  // This closes out all remaining database connections after the file finishes
  // running.
  await db.destroy();
});

it("should return all users", async () => {

  try {
    await db.from("users").insert([{
        // id: 1, (auto)
        username: "landlord",
        password: "examplepass",
        name: {
          title: "Title",
          firstname: "Firstname",
          middlename: "Middlename",
          lastname: "Lastname",
          suffix: "Suffix",
          preferredname: "Preferred"
        },
        email: "landlord@email.com",
        address: {
          street: "1 First St",
          street2: "Suite 2",
          city: "Salt Lake City",
          state: "Utah",
          zip: "84101",
          country: "USA"
        },
        type: "landlord",
        phone: "123-456-7890"
      },
      {
        // id: 2, (auto)
        username: "dev",
        password: "pass",
        name: {
          firstname: "Web",
          lastname: "Dev"
        },
        email: "dev@email.com",
        type: "dev"
      }]);

    const users = await Users.getAll();

    expect(users).toEqual([{
        // id: 1, (auto)
        username: "landlord",
        password: "examplepass",
        name: {
          title: "Title",
          firstname: "Firstname",
          middlename: "Middlename",
          lastname: "Lastname",
          suffix: "Suffix",
          preferredname: "Preferred"
        },
        email: "landlord@email.com",
        address: {
          street: "1 First St",
          street2: "Suite 2",
          city: "Salt Lake City",
          state: "Utah",
          zip: "84101",
          country: "USA"
        },
        type: "landlord",
        phone: "123-456-7890"
      },
      {
        // id: 2, (auto)
        username: "dev",
        password: "pass",
        name: {
          firstname: "Web",
          lastname: "Dev"
        },
        email: "dev@email.com",
        type: "dev"
      }]);
  } catch (err) {
    console.error(err);
    }
})

// test for finding a user and type by an ID

it("should return a username and type by ID", async () => {

    try {
      await db.from("users").insert([{
          id: 1,
          username: "landlord",
          password: "examplepass",
          name: {
            title: "Title",
            firstname: "Firstname",
            middlename: "Middlename",
            lastname: "Lastname",
            suffix: "Suffix",
            preferredname: "Preferred"
          },
          email: "landlord@email.com",
          address: {
            street: "1 First St",
            street2: "Suite 2",
            city: "Salt Lake City",
            state: "Utah",
            zip: "84101",
            country: "USA"
          },
          type: "landlord",
          phone: "123-456-7890"
        },
        {
          id: 2,
          username: "dev",
          password: "pass",
          name: {
            firstname: "Web",
            lastname: "Dev"
          },
          email: "dev@email.com",
          type: "dev"
        }]);
  
      const user = await Users.findById(1);
  
      expect(user).toEqual({
        username: "landlord",
        type: "landlord"
      });
    } catch (err) {
      console.error(err);
      }
  })
  
