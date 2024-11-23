import express from "express"
import wichtelService = require("./wichtelService")
import { WichtelData, WichteleeData } from "../models/models"

const wichtelRouter = express.Router()
wichtelRouter.post("/", setWichtelData)
wichtelRouter.get("/", getWichtelData)
wichtelRouter.get("/wichtelee", getWichtelee)

function setWichtelData(
  req: express.Request,
  res: express.Response,
  next: any
) {
  wichtelService.setWichtelData(req.body).catch(next)
}
function getWichtelData(
  req: express.Request,
  res: express.Response,
  next: any
) {
  wichtelService
    .getWichtelData(req)
    .then((wichtelData: WichtelData) => res.json(wichtelData))
    .catch(next)
}
function getWichtelee(req: express.Request, res: express.Response, next: any) {
  wichtelService
    .getWichtelee(req)
    .then((wichtelee: WichteleeData) => res.json(wichtelee))
    .catch(next)
}

export default wichtelRouter
