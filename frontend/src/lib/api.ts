import { session } from "./session"

const BASE_URL: string = import.meta.env.VITE_API_URL ?? "/api"

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = session.get()
  let res: Response
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers: {
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, "Network error")
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    // expired or revoked token → back to login
    if (res.status === 401 && token) session.clear()
    throw new ApiError(res.status, data.message ?? res.statusText)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

// ------------------------------------------------------------------ types

export interface User {
  username: string
  email: string
}

interface Session extends User {
  token: string
}

export interface WichtelData {
  wish: string | null
  address: string | null
}

export interface Wichtelee extends WichtelData {
  username: string
}

export interface Status {
  enddate: string
  over: boolean
  drawn: boolean
}

// -------------------------------------------------------------- endpoints

export async function login(username: string, password: string) {
  const res = await request<Session>("POST", "/user/authenticate", { username, password })
  session.set(res.token)
}

export async function register(username: string, email: string, password: string) {
  const res = await request<Session>("POST", "/user/create", { username, email, password })
  session.set(res.token)
}

export const logout = () => session.clear()

export const resetPassword = (email: string) =>
  request<void>("POST", "/user/reset", { email })

export const getUser = () => request<User>("GET", "/user")

export const updateUser = (changes: Partial<User & { password: string }>) =>
  request<User>("PATCH", "/user", changes)

export async function deleteUser() {
  await request<void>("DELETE", "/user")
  session.clear()
}

export const getStatus = () => request<Status>("GET", "/wichtel/status")

export const getWichtelData = () => request<WichtelData>("GET", "/wichtel")

export const saveWichtelData = (data: Partial<WichtelData>) =>
  request<WichtelData>("POST", "/wichtel", data)

export const getWichtelee = () => request<Wichtelee>("GET", "/wichtel/wichtelee")
