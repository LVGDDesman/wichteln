import { shuffle } from "../_helper/arrayUtils"
import { HttpError } from "../_helper/errorhandler"
import {
    User,
    UserWithWichtelee,
    WichtelData,
    WichteleeData,
} from "../models/models"
import DataBaseInstance from "../services/databaseService"
const config = require("../config.json")

export async function setWichtelData(userId: Number, req: any) {
    const wichtelData: WichtelData = req
    await DataBaseInstance.setWichtelData(userId, wichtelData)
}

export async function getWichtelData(userId: Number): Promise<WichtelData> {
    const wichtelInfo: WichtelData = {
        ...(await DataBaseInstance.getWichtelData(userId)),
    }
    return wichtelInfo
}

export async function getWichtelee(userId: Number): Promise<WichteleeData> {
    const wichteleeInfo: WichteleeData = {
        ...(await DataBaseInstance.getWichteleeData(userId)),
    }
    return wichteleeInfo
}

export async function endWichtel(): Promise<void> {
    if (Date.now() < Date.parse(config.wichteln.enddate)) {
        // Tried to start wichtel before its time, Fail
        throw {
            status: 412,
            message: `It's not ${config.wichteln.enddate} yet! Please wait...`,
        } as HttpError
    }
    const proofOfEnd = await DataBaseInstance.getFirstUser()
    if (proofOfEnd.wichtelee) {
        throw {
            status: 409,
            message:
                "Wichtel has already ended! You cannot end it again. Try it next year",
        } as HttpError
    }
    const users: User[] = await DataBaseInstance.getAllUsers()
    const shuffled: User[] = shuffle(users)
    const assigned: UserWithWichtelee[] = []
    shuffled.forEach((user, i) => {
        assigned.push({
            ...user,
            wichtelee: shuffled.at(i - 1)!.id,
        } as UserWithWichtelee)
    })
    await DataBaseInstance.setWichtelees(assigned)
}

export async function getWichtelEndDate(): Promise<String> {
    return config.wichteln.enddate
}
