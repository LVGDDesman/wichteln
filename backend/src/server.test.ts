const request = require("supertest")
const app = require("./server")

describe("Wichteln API Tester", () => {
  let jwt: string
  const username

  it("should register", async () => {
    const res = await request(app).post("/api/user/create").send({
      username: "oakawd",
      email: "okaawd@okawd.rjb",
      password: "okawd",
    })

    expect(res.statusCode).toEqual(201)
    expect(res.body.username).toEqual("oakawd")
    expect(res.body.email).toEqual("okaawd@okawd.rjb")
    expect(res.body.token).toBe(String)
    jwt = res.body.token
  })
})
