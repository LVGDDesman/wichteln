import type { ErrorRequestHandler } from "express"

export class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err?.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" })
    return
  }

  // HttpError as well as errors from express-openapi-validator carry a status
  const status = typeof err?.status === "number" ? err.status : 500
  if (status >= 500) console.error(err)

  res.status(status).json({
    message: status >= 500 ? "Internal server error" : err.message,
  })
}
