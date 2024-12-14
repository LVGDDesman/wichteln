import express from "express"
import { expressjwt } from "express-jwt"
import { JwtPayload } from "jsonwebtoken"
import { jwtDecode } from "jwt-decode"
const config = require("../config.json")

function jwtauth() {
    const secret: string = config.jwt.secret
    return expressjwt({ secret, algorithms: ["HS256"] }).unless({
        path: [
            // public routes that don't require authentication
            config.api.baseurl + "/user/authenticate",
            config.api.baseurl + "/user/create",
            config.api.baseurl + "/user/reset",
        ],
    })
}

export default jwtauth

export function getUserIdFromJwt(token: string): Number {
    const jwt = jwtDecode<JwtPayload>(token)
    return parseInt(jwt.id)
}

export function removeBearerPrefix(auth: string): string {
    return auth.split(" ")[1]
}

export function getUserIdFromRequest(req: express.Request): Number {
    return getUserIdFromJwt(removeBearerPrefix(req.headers["authorization"]!))
}
