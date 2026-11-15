import mariadb from "mariadb"
import { config } from "./config.ts"

export interface User {
  id: number
  username: string
  email: string
  password: string
}

export interface WichtelData {
  wish: string | null
  address: string | null
}

export interface Wichtelee extends WichtelData {
  username: string
}

export interface Assignment {
  id: number
  wichtelee: number
}

const pool = mariadb.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: 5,
  bigIntAsNumber: true,
  insertIdAsNumber: true,
})

export const closeDb = () => pool.end()

/** Creates the schema on a fresh database. Existing tables are left untouched. */
export async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user (
      id        INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username  VARCHAR(255) NOT NULL UNIQUE,
      email     VARCHAR(255) NOT NULL UNIQUE,
      password  VARCHAR(255) NOT NULL,
      wish      TEXT NULL,
      address   TEXT NULL,
      wichtelee INT UNSIGNED NULL
    ) DEFAULT CHARSET = utf8mb4
  `)
}

// ---------------------------------------------------------------- users

export async function findUserByLogin(login: string): Promise<User | undefined> {
  const rows = await pool.query<User[]>(
    "SELECT id, username, email, password FROM user WHERE username = ? OR email = ? LIMIT 1",
    [login, login]
  )
  return rows[0]
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const rows = await pool.query<User[]>(
    "SELECT id, username, email, password FROM user WHERE email = ?",
    [email]
  )
  return rows[0]
}

export async function findUserById(id: number): Promise<User | undefined> {
  const rows = await pool.query<User[]>(
    "SELECT id, username, email, password FROM user WHERE id = ?",
    [id]
  )
  return rows[0]
}

/** True if another user (≠ excludeId) already uses the username or email. */
export async function isTaken(
  username: string,
  email: string,
  excludeId = 0
): Promise<boolean> {
  const rows = await pool.query<{ count: number }[]>(
    "SELECT COUNT(*) AS count FROM user WHERE (username = ? OR email = ?) AND id <> ?",
    [username, email, excludeId]
  )
  return rows[0].count > 0
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string
): Promise<number> {
  const result = await pool.query(
    "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  )
  return result.insertId
}

export async function updateUser(user: User): Promise<void> {
  await pool.query(
    "UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?",
    [user.username, user.email, user.password, user.id]
  )
}

export async function deleteUser(id: number): Promise<void> {
  await pool.query("DELETE FROM user WHERE id = ?", [id])
}

// --------------------------------------------------------------- wichtel

export async function getWichtelData(id: number): Promise<WichtelData | undefined> {
  const rows = await pool.query<WichtelData[]>(
    "SELECT wish, address FROM user WHERE id = ?",
    [id]
  )
  return rows[0]
}

export async function setWichtelData(id: number, data: Partial<WichtelData>): Promise<void> {
  await pool.query(
    "UPDATE user SET wish = COALESCE(?, wish), address = COALESCE(?, address) WHERE id = ?",
    [data.wish ?? null, data.address ?? null, id]
  )
}

export async function getWichtelee(id: number): Promise<Wichtelee | undefined> {
  const rows = await pool.query<Wichtelee[]>(
    `SELECT target.username, target.wish, target.address
       FROM user AS giver
       JOIN user AS target ON target.id = giver.wichtelee
      WHERE giver.id = ?`,
    [id]
  )
  return rows[0]
}

export async function isDrawn(): Promise<boolean> {
  const rows = await pool.query<{ count: number }[]>(
    "SELECT COUNT(*) AS count FROM user WHERE wichtelee IS NOT NULL"
  )
  return rows[0].count > 0
}

/**
 * Atomically stores the assignments – unless a draw already happened.
 * Returns false if it was already drawn (e.g. by a concurrent call).
 */
export async function saveDraw(
  build: (users: User[]) => Assignment[]
): Promise<{ drawn: boolean; users: User[]; assignments: Assignment[] }> {
  const con = await pool.getConnection()
  try {
    await con.beginTransaction()
    const users = await con.query<(User & { wichtelee: number | null })[]>(
      "SELECT id, username, email, password, wichtelee FROM user FOR UPDATE"
    )
    if (users.some((u) => u.wichtelee !== null)) {
      await con.rollback()
      return { drawn: false, users, assignments: [] }
    }
    const assignments = build(users)
    await con.batch(
      "UPDATE user SET wichtelee = ? WHERE id = ?",
      assignments.map((a) => [a.wichtelee, a.id])
    )
    await con.commit()
    return { drawn: true, users, assignments }
  } catch (e) {
    await con.rollback()
    throw e
  } finally {
    con.release()
  }
}
