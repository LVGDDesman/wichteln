import bcrypt from "bcryptjs"
import type { Request } from "express"
import { expressjwt } from "express-jwt"
import jwt, { type SignOptions } from "jsonwebtoken"
import { config } from "./config.ts"
import { HttpError } from "./errors.ts"

const ALGORITHM = "HS256"

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10)

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash)

export function createToken(userId: number): string {
  // `id` claim kept as string for compatibility with already issued tokens
  return jwt.sign({ id: String(userId) }, config.jwt.secret, {
    algorithm: ALGORITHM,
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  })
}

/** Rejects requests without a valid bearer token, except for public routes. */
export const requireAuth = () =>
  expressjwt({ secret: config.jwt.secret, algorithms: [ALGORITHM] }).unless({
    path: [
      "/api/health",
      "/api/user/authenticate",
      "/api/user/create",
      "/api/user/reset",
    ],
  })

export function userId(req: Request): number {
  const id = Number((req as Request & { auth?: { id?: string } }).auth?.id)
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(401, "Invalid token")
  return id
}
