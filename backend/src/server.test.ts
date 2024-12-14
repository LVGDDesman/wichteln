const request = require("supertest")
const app = require("./server")

afterAll(() => {
  app.closeServer()
})

describe("Wichteln User API Tester", () => {
  let jwt: string
  const username = "abcdefg"
  const email = "abc@e.fg"
  const password = "okawd"
  it("should register", async () => {
    const res = await request(app).post("/api/user/create").send({
      username: username,
      email: email,
      password: password,
    })

    expect(res.statusCode).toEqual(201)
    expect(res.body.username).toEqual(username)
    expect(res.body.email).toEqual(email)
    expect(res.body.token).not.toBeNull()
    jwt = res.body.token
  })

  it("should login", async () => {
    const res = await request(app).post("/api/user/authenticate").send({
      username: username,
      password: password,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.username).toEqual(username)
    expect(res.body.email).toEqual(email)
    expect(res.body.token).not.toBeNull()
    jwt = res.body.token
  })

  it("should get user", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${jwt}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.username).toEqual(username)
    expect(res.body.email).toEqual(email)
  })

  it("should update user", async () => {
    const res = await request(app)
      .post("/api/user/update")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        username: username + "AAA",
        email: email + "AAA",
        password: password + "AAA",
      })
    console.log(res.body)
    expect(res.statusCode).toEqual(200)
  })
  it("should get new user", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${jwt}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.username).toEqual(username + "AAA")
    expect(res.body.email).toEqual(email + "AAA")
  })

  it("should delete", async () => {
    const res = await request(app)
      .get("/api/user/delete")
      .set("Authorization", `Bearer ${jwt}`)

    expect(res.statusCode).toEqual(200)
  })
})
