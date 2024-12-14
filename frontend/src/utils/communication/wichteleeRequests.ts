import axios from "axios"
import { BASE_URL } from "../environments"

export interface WichtelData {
    address: string
    wish: string
}

export interface WichteleeData extends WichtelData {
    username: string
}

export async function getWichtelEndDate(jwt: string): Promise<string> {
    const response = await axios.get(
        `${BASE_URL}/wichtel/enddate`,
        getAuthHeader(jwt)
    )
    return response.data
}

export async function getWichtelData(jwt: string): Promise<WichtelData> {
    const response = await axios.get(`${BASE_URL}/wichtel`, getAuthHeader(jwt))
    return response.data
}

export async function submitWichtelData(
    jwt: string,
    data: WichtelData
): Promise<any> {
    const response = await axios.post(
        `${BASE_URL}/wichtel`,
        data,
        getAuthHeader(jwt)
    )
    return response.data
}

export async function getWichtelee(jwt: string): Promise<WichteleeData> {
    const response = await axios.get(
        `${BASE_URL}/wichtel/wichtelee`,
        getAuthHeader(jwt)
    )
    return response.data
}

function getAuthHeader(jwt: string) {
    return { headers: { Authorization: `Bearer ${jwt}` } }
}
