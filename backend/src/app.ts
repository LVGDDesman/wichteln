import cors from "cors"
import express from "express"
import * as OpenApiValidator from "express-openapi-validator"
import { fileURLToPath } from "node:url"
import { requireAuth } from "./auth.ts"
import { errorHandler } from "./errors.ts"
import { userRouter } from "./users/userRouter.ts"
import { wichtelRouter } from "./wichtel/wichtelRouter.ts"

// Same relative location from src/ (dev) and dist/ (prod)
const apiSpec = fileURLToPath(new URL("../wichteln_api.yaml", import.meta.url))

export function createApp() {
  const app = express()

  app.disable("x-powered-by")
  app.set("trust proxy", true)
  app.use(cors())
  app.use(express.json({ limit: "32kb" }))

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" })
  })

  app.use(requireAuth())
  app.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateRequests: true,
      validateResponses: process.env.NODE_ENV !== "production",
    })
  )

  app.use("/api/user", userRouter)
  app.use("/api/wichtel", wichtelRouter)

  app.use(errorHandler)
  return app
}
