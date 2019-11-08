const cleaner = require("knex-cleaner");
const Properties = require("./propertiesModel");
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

it("should return all properties in the database", async () => {
    try {
        await db.from("properties").insert([
            {
            // id: 1, (auto)
            'property-name': "Name for the Property",
            'property-address': {
                street: "1 First St",
                street2: "Suite 2",
                city: "Salt Lake City",
                state: "Utah",
                zip: "84101",
                country: "USA"
            },
            'property-image': "property.jpg",
            'property-status': "occupied", // open, closed, occupied, forRent, forSale
            'property-startdate': "01-01-2001",
            'property-enddate': null,
            'landlord-id': 1
            },
            {
            // id: 2, (auto)
            'property-name': "Sample",
            'property-address': {},
            'property-status': "closed", // closed - no longer an active property
            'property-startdate': "01-01-2001",
            'property-enddate': "05-01-2018",
            'landlord-id': 1
            }])

    const properties = await Properties.getAll();

    expect(properties).toEqual([{
        // id: 1, (auto)
        'property-name': "Name for the Property",
        'property-address': {
            street: "1 First St",
            street2: "Suite 2",
            city: "Salt Lake City",
            state: "Utah",
            zip: "84101",
            country: "USA"
        },
        'property-image': "property.jpg",
        'property-status': "occupied", // open, closed, occupied, forRent, forSale
        'property-startdate': "01-01-2001",
        'property-enddate': null,
        'landlord-id': 1
        },
        {
        // id: 2, (auto)
        'property-name': "Sample",
        'property-address': {},
        'property-status': "closed", // closed - no longer an active property
        'property-startdate': "01-01-2001",
        'property-enddate': "05-01-2018",
        'landlord-id': 1
        }]);
  } 
    catch (err) {
    console.error(err);
    }
});
