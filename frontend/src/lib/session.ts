import { useSyncExternalStore } from "react"

const KEY = "wichteln.token"
const listeners = new Set<() => void>()

function read(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function write(token: string | null) {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    // storage unavailable (private mode) – session lasts until reload
  }
  current = token
  listeners.forEach((l) => l())
}

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/** Tokens used to live in a "user" cookie (react-cookie) – move them over once. */
function migrateLegacyCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)user=([^;]+)/)
  if (!match) return null
  document.cookie = "user=; Max-Age=0; path=/"
  document.cookie = "date=; Max-Age=0; path=/"
  return decodeURIComponent(match[1])
}

let current: string | null = read() ?? migrateLegacyCookie()
if (current && isExpired(current)) current = null
write(current)

export const session = {
  get: () => current,
  set: (token: string) => write(token),
  clear: () => write(null),
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useToken(): string | null {
  return useSyncExternalStore(session.subscribe, session.get)
}
