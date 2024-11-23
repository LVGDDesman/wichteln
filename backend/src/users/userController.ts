import express from "express"
import userService = require("./userService")
import { externalUser, login } from "../models/models"

const userRouter = express.Router()
userRouter.post("/authenticate", authenticate)
userRouter.get("/", getUser)
userRouter.post("/create", createUser)
userRouter.post("/update", updateUser)
userRouter.get("/delete", deleteUser)
userRouter.post("/reset", resetPassword)

function createUser(req: express.Request, res: express.Response, next: any) {
  userService
    .createUser(req.body)
    .then((user: externalUser) => res.status(201).json(user))
    .catch(next)
}

function authenticate(req: express.Request, res: express.Response, next: any) {
  userService
    .authenticate(req.body)
    .then((user: externalUser) => res.json(user))
    .catch(next)
}

function getUser(req: express.Request, res: express.Response, next: any) {
  userService
    .getUser(req)
    .then((user: externalUser) => res.json(user))
    .catch(next)
}

function updateUser(req: express.Request, res: express.Response, next: any) {
  userService
    .updateUser(req)
    .then((user: any) => res.json(user))
    .catch(next)
}
function deleteUser(req: express.Request, res: express.Response, next: any) {
  userService.deleteUser(req).catch(next)
}
function resetPassword(req: express.Request, res: express.Response, next: any) {
  userService.resetPassword(req.body).catch(next)
}
export default userRouter
