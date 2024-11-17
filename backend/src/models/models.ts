
export interface login {
    email:string,
    password:string
}

export interface externalUser {
    email:string,
    username: string,
    token?: string,
}

export interface User {
    id: number,
    email:string,
    username: string,
    password: string,
}

export interface UserData extends externalUser {
    wichtelee?: number,
    wish?: string,
    address?: string
}