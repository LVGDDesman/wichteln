import { Router } from "express"
import { userId } from "../auth.ts"
import * as wichtel from "./wichtelService.ts"

export const wichtelRouter = Router()
  .get("/status", async (_req, res) => {
    res.json(await wichtel.getStatus())
  })
  .get("/", async (req, res) => {
    res.json(await wichtel.getWichtelData(userId(req)))
  })
  .post("/", async (req, res) => {
    res.json(await wichtel.setWichtelData(userId(req), req.body))
  })
  .get("/wichtelee", async (req, res) => {
    res.json(await wichtel.getWichtelee(userId(req)))
  })
  .post("/end", async (_req, res) => {
    await wichtel.draw()
    res.status(204).end()
  })
