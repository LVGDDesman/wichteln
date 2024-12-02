import express from "express"
import wichtelService = require("./wichtelService")
import { WichtelData, WichteleeData } from "../models/models"
import { date } from "express-openapi-validator/dist/framework/base.serdes"

const wichtelRouter = express.Router()
wichtelRouter.post("/", setWichtelData)
wichtelRouter.get("/", getWichtelData)
wichtelRouter.get("/wichtelee", getWichtelee)
wichtelRouter.post("/start", startWichtel)
wichtelRouter.get("/date", getWichtelDate)

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

function startWichtel(req: express.Request, res: express.Response, next: any) {
    wichtelService
        .startWichtel()
        .then((_) => res.json())
        .catch(next)
}

function getWichtelDate(
    req: express.Request,
    res: express.Response,
    next: any
) {
    wichtelService
        .getWichtelDate()
        .then((date) => res.json(date))
        .catch(next)
}

export default wichtelRouter
