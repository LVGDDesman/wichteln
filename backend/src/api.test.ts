/**
 * End-to-end API test against a real MariaDB.
 * Runs only with INTEGRATION=1 and a CONFIG_PATH pointing to a throw-away database:
 *
 *   INTEGRATION=1 CONFIG_PATH=./config.test.json npm test
 */
import assert from "node:assert/strict"
import { after, before, describe, it } from "node:test"

describe("Wichteln API", { skip: !process.env.INTEGRATION }, async () => {
  const { default: request } = await import("supertest")
  const { createApp } = await import("./app.ts")
  const db = await import("./db.ts")

  const app = createApp()
  const suffix = Date.now().toString(36)
  const user = { username: `elf-${suffix}`, email: `elf-${suffix}@example.org`, password: "secret123" }
  const other = { username: `rudolph-${suffix}`, email: `rudolph-${suffix}@example.org`, password: "secret123" }
  let token = ""
  let otherToken = ""
  const auth = () => ({ Authorization: `Bearer ${token}` })

  before(() => db.migrate())
  after(async () => {
    for (const t of [token, otherToken]) {
      if (t) await request(app).delete("/api/user").set("Authorization", `Bearer ${t}`)
    }
    await db.closeDb()
  })

  it("serves a health check", async () => {
    const res = await request(app).get("/api/health")
    assert.equal(res.status, 200)
  })

  it("rejects requests without token", async () => {
    const res = await request(app).get("/api/user")
    assert.equal(res.status, 401)
  })

  it("validates registration input", async () => {
    const res = await request(app).post("/api/user/create").send({ ...user, password: "123" })
    assert.equal(res.status, 400)
  })

  it("registers", async () => {
    const res = await request(app).post("/api/user/create").send(user)
    assert.equal(res.status, 201)
    assert.equal(res.body.username, user.username)
    assert.equal(res.body.email, user.email)
    assert.ok(res.body.token)
    token = res.body.token
  })

  it("refuses duplicate username or email", async () => {
    const res = await request(app)
      .post("/api/user/create")
      .send({ ...other, email: user.email })
    assert.equal(res.status, 409)
  })

  it("logs in with username and with email", async () => {
    for (const login of [user.username, user.email]) {
      const res = await request(app)
        .post("/api/user/authenticate")
        .send({ username: login, password: user.password })
      assert.equal(res.status, 200, login)
      assert.ok(res.body.token)
    }
  })

  it("rejects wrong passwords", async () => {
    const res = await request(app)
      .post("/api/user/authenticate")
      .send({ username: user.username, password: "wrong-password" })
    assert.equal(res.status, 401)
  })

  it("returns the current user", async () => {
    const res = await request(app).get("/api/user").set(auth())
    assert.equal(res.status, 200)
    assert.deepEqual(res.body, { username: user.username, email: user.email })
  })

  it("cannot take another user's name", async () => {
    const created = await request(app).post("/api/user/create").send(other)
    assert.equal(created.status, 201)
    otherToken = created.body.token

    const res = await request(app).patch("/api/user").set(auth()).send({ username: other.username })
    assert.equal(res.status, 409)
  })

  it("updates the user, including the password", async () => {
    user.username += "-x"
    const res = await request(app)
      .patch("/api/user")
      .set(auth())
      .send({ username: user.username, password: "new-secret" })
    assert.equal(res.status, 200)
    assert.equal(res.body.username, user.username)
    assert.equal(res.body.email, user.email)

    const login = await request(app)
      .post("/api/user/authenticate")
      .send({ username: user.username, password: "new-secret" })
    assert.equal(login.status, 200)
  })

  it("stores and returns wish and address", async () => {
    const empty = await request(app).get("/api/wichtel").set(auth())
    assert.deepEqual(empty.body, { wish: null, address: null })

    const saved = await request(app).post("/api/wichtel").set(auth()).send({ wish: "Socken 🧦" })
    assert.equal(saved.status, 200)
    assert.deepEqual(saved.body, { wish: "Socken 🧦", address: null })

    const both = await request(app).post("/api/wichtel").set(auth()).send({ address: "Nordpol 1" })
    assert.deepEqual(both.body, { wish: "Socken 🧦", address: "Nordpol 1" })
  })

  it("reports the status", async () => {
    const res = await request(app).get("/api/wichtel/status").set(auth())
    assert.equal(res.status, 200)
    assert.equal(typeof res.body.enddate, "string")
    assert.equal(typeof res.body.drawn, "boolean")
  })

  it("answers 404 while nothing is drawn", async () => {
    if (await db.isDrawn()) return
    const res = await request(app).get("/api/wichtel/wichtelee").set(auth())
    assert.equal(res.status, 404)
  })

  it("does not reveal whether an email exists on reset", async () => {
    const res = await request(app).post("/api/user/reset").send({ email: "nobody@example.org" })
    assert.equal(res.status, 204)
  })
})
