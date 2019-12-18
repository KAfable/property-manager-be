const supertest = require("supertest");
const app = require("../../server");
const { Db, Models } = require("../../test-utils");

const admin = require("../../lib/admin");

const req = supertest(app);

beforeEach(async () => {
  await Db.reset();
});

afterAll(async () => {
  await Db.destroyConn();
});

const testFixture = () =>
  Db.insertUsers([
    Models.createLandlord(),
    Models.createTenant({ email: "tenantemail@gmail.com" })
  ]);

describe("GET /api/users/me", () => {
  const endpoint = "/api/users/me";

  it("should return a 401 if the user is not authorized", async () => {
    await testFixture();

    const result = await req.get(endpoint);

    expect(result.status).toBe(401);
  });

  it("should return a 200 if the user is authorized", async () => {
    let [, tenant] = await testFixture();

    admin.verifyIdToken.mockResolvedValue({ email: tenant.email });

    const res = await req.get(endpoint).set("Authorization", "Bearer 1234");

    expect(res.status).toBe(200);
  });

  it("should return user info in the correct shape", async () => {
    let [landlord] = await testFixture();

    admin.verifyIdToken.mockResolvedValue({ email: landlord.email });

    const res = await req.get(endpoint).set("Authorization", "Bearer 1234");

    expect(res.body).toEqual({
      firstName: landlord.firstName,
      lastName: landlord.lastName,
      type: "landlord"
    });
  });
});

describe("PUT /api/users/me", () => {
  const endpoint = "/api/users/me";

  it("should return 401 if the user is not authroized", async () => {
    await testFixture();

    const update = {
      firstName: "George"
    };

    const res = await req.put(endpoint).send(update);

    expect(res.status).toBe(401);
  });

  it.skip("should return 200 if the user is succesful", async () => {
    let [landlord] = await testFixture();

    const update = {
      firstName: "George"
    };

    admin.verifyIdToken.mockResolvedValue({ email: landlord.email });
    const res = await req
      .put(endpoint)
      .set("Authorization", "Bearer 1234")
      .send(update);

    expect(res.status).toBe(200);
  });

  it.skip("should return the updated user", async () => {
    let [landlord] = await testFixture();

    const update = {
      firstName: "George"
    };

    admin.verifyIdToken.mockResolvedValue({ email: landlord.email });
    const res = await req
      .put(endpoint)
      .set("Authorization", "Bearer 1234")
      .send(update);

    expect(res.body).toEqual({ ...landlord, ...update });
  });
});
