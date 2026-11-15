import { Router } from "express"
import { userId } from "../auth.ts"
import * as users from "./userService.ts"

// Express 5 forwards rejected promises to the error handler automatically.
export const userRouter = Router()
  .post("/create", async (req, res) => {
    const { username, email, password } = req.body
    res.status(201).json(await users.register(username, email, password))
  })
  .post("/authenticate", async (req, res) => {
    const { username, password } = req.body
    res.json(await users.authenticate(username, password))
  })
  .post("/reset", async (req, res) => {
    await users.resetPassword(req.body.email)
    res.status(204).end()
  })
  .get("/", async (req, res) => {
    res.json(await users.getUser(userId(req)))
  })
  .patch("/", async (req, res) => {
    res.json(await users.updateUser(userId(req), req.body))
  })
  .delete("/", async (req, res) => {
    await users.deleteUser(userId(req))
    res.status(204).end()
  })
