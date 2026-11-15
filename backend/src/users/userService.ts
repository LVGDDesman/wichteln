import { randomInt } from "node:crypto"
import passwords from "../data/passwords.json" with { type: "json" }
import { createToken, hashPassword, verifyPassword } from "../auth.ts"
import { isOver } from "../config.ts"
import * as db from "../db.ts"
import { HttpError } from "../errors.ts"
import { sendPasswordReset } from "../mail.ts"

export interface PublicUser {
  username: string
  email: string
}

export interface Session extends PublicUser {
  token: string
}

const toPublic = ({ username, email }: db.User): PublicUser => ({ username, email })

export async function register(
  username: string,
  email: string,
  password: string
): Promise<Session> {
  if (isOver()) throw new HttpError(403, "Registration is closed")
  if (await db.isTaken(username, email)) {
    throw new HttpError(409, "Username or email already taken")
  }
  const id = await db.createUser(username, email, await hashPassword(password))
  return { username, email, token: createToken(id) }
}

/** `login` may be either username or email. */
export async function authenticate(login: string, password: string): Promise<Session> {
  const user = await db.findUserByLogin(login)
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new HttpError(401, "Username or password is incorrect")
  }
  return { ...toPublic(user), token: createToken(user.id) }
}

export async function getUser(id: number): Promise<PublicUser> {
  const user = await db.findUserById(id)
  if (!user) throw new HttpError(404, "User not found")
  return toPublic(user)
}

export async function updateUser(
  id: number,
  changes: { username?: string; email?: string; password?: string }
): Promise<PublicUser> {
  const user = await db.findUserById(id)
  if (!user) throw new HttpError(404, "User not found")

  const updated: db.User = {
    id,
    username: changes.username || user.username,
    email: changes.email || user.email,
    password: changes.password ? await hashPassword(changes.password) : user.password,
  }
  if (await db.isTaken(updated.username, updated.email, id)) {
    throw new HttpError(409, "Username or email already taken")
  }
  await db.updateUser(updated)
  return toPublic(updated)
}

export async function deleteUser(id: number): Promise<void> {
  if (isOver()) {
    throw new HttpError(403, "The draw is over – leaving now would leave someone without a gift")
  }
  await db.deleteUser(id)
}

/**
 * Generates a festive word password and mails it. Unknown addresses are
 * silently ignored so the endpoint cannot be used to probe for accounts.
 */
export async function resetPassword(email: string): Promise<void> {
  const user = await db.findUserByEmail(email)
  if (!user) return

  const password = Array.from(
    { length: 3 },
    () => passwords[randomInt(passwords.length)]
  ).join("")

  await db.updateUser({ ...user, password: await hashPassword(password) })
  await sendPasswordReset(user, password)
}
