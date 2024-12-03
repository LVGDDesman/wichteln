import express from "express"
import wichtelService = require("./wichtelService")
import { WichtelData, WichteleeData } from "../models/models"
import { date } from "express-openapi-validator/dist/framework/base.serdes"

const wichtelRouter = express.Router()
wichtelRouter.post("/", setWichtelData)
wichtelRouter.get("/", getWichtelData)
wichtelRouter.get("/wichtelee", getWichtelee)
wichtelRouter.post("/end", endWichtel)
wichtelRouter.get("/enddate", getWichtelEndDate)

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

function endWichtel(req: express.Request, res: express.Response, next: any) {
    wichtelService
        .endWichtel()
        .then((_) => res.json())
        .catch(next)
}

function getWichtelEndDate(
    req: express.Request,
    res: express.Response,
    next: any
) {
    wichtelService
        .getWichtelEndDate()
        .then((date) => res.json(date))
        .catch(next)
}

export default wichtelRouter
