import { WichtelData, WichteleeData } from "../models/models"
import DataBaseInstance from "../services/databaseService"
const config = require("../config.json")

export async function setWichtelData(req: any) {
    const userId: number = req.auth.userId
    const wichtelData: WichtelData = req.body
    await DataBaseInstance.setWichtelData(userId, wichtelData)
}

export async function getWichtelData(req: any): Promise<WichtelData> {
    const userId: number = req.auth.userId
    const wichtelInfo: WichtelData = {
        ...(await DataBaseInstance.getWichtelData(userId)),
    }
    return wichtelInfo
}

export async function getWichtelee(req: any): Promise<WichteleeData> {
    const userId: number = req.auth.userId
    return await DataBaseInstance.getWichteleeData(userId)
}

export async function startWichtel() {}

export async function getWichtelDate(): Promise<String> {
    return config.wichteln.enddate
}
