
export interface User {
    id: number,
    email:string,
    username: string,
    hash: string
}

export interface UserData extends User {
    wichtelee?: number,
    wish?: string,
    address?: string
}