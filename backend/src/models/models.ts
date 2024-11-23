export interface login {
  email: string
  password: string
}

export interface externalUser {
  email: string
  username: string
  token?: string
}

export interface User {
  id: number
  email: string
  username: string
  password: string
}

export interface WichtelData {
  wish?: string
  address?: string
}
export interface WichtelInfo extends WichtelData {
  date: number
}
export interface WichteleeData extends WichtelData {
  wichtelee: string
}
