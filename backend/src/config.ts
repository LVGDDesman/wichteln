import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

export interface Config {
  port: number
  db: {
    host: string
    port?: number
    user: string
    password: string
    database: string
  }
  jwt: {
    secret: string
    expiresIn?: string
  }
  mail: {
    host: string
    port: number
    tls: boolean
    user: string
    password: string
    username: string
  }
  wichteln: {
    /** ISO date – after this point wishes are locked and the draw happens. */
    enddate: string
  }
}

/**
 * Lookup order:
 *  1. $CONFIG_PATH
 *  2. ./config.json (working directory, used by the Docker image)
 *  3. src/config.json (legacy location)
 */
function resolveConfigPath(): string {
  const candidates = [
    process.env.CONFIG_PATH,
    "config.json",
    fileURLToPath(new URL("./config.json", import.meta.url)),
  ].filter((p): p is string => Boolean(p))

  const found = candidates.find((p) => existsSync(p))
  if (!found) {
    throw new Error(
      `No config found. Tried: ${candidates.join(", ")}. Copy config.json.template to config.json.`
    )
  }
  return found
}

function loadConfig(): Config {
  const raw = JSON.parse(readFileSync(resolveConfigPath(), "utf8"))

  const required = ["db", "jwt", "mail", "wichteln"] as const
  for (const key of required) {
    if (!raw[key]) throw new Error(`Config is missing section "${key}"`)
  }
  if (!raw.jwt.secret || raw.jwt.secret.length < 16) {
    console.warn("⚠️  jwt.secret is short – use at least 32 random characters.")
  }
  if (Number.isNaN(Date.parse(raw.wichteln.enddate))) {
    throw new Error(`wichteln.enddate is not a valid date: ${raw.wichteln.enddate}`)
  }

  return {
    port: Number(process.env.PORT ?? raw.port ?? 3000),
    db: { ...raw.db, password: String(raw.db.password) },
    jwt: { expiresIn: "7d", ...raw.jwt },
    mail: { ...raw.mail, port: Number(raw.mail.port), tls: Boolean(raw.mail.tls) },
    wichteln: { enddate: raw.wichteln.enddate },
  }
}

export const config: Config = loadConfig()

export const endDate = (): Date => new Date(config.wichteln.enddate)
export const isOver = (): boolean => Date.now() >= endDate().getTime()
