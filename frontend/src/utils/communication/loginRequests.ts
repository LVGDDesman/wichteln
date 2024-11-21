import axios from "axios"
import { BASE_URL } from "../environments"

export async function registerUser(
    email: string,
    username: string,
    password: string
): Promise<string> {
    const response = await axios.post(`${BASE_URL}/user/create`, {
        email: email,
        username: username,
        password: password,
    })
    return response.data.token
}
