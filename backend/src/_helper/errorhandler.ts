import express from "express"

export interface HttpError extends Error {
    status: number
}

function errorHandler(
    err: any,
    req: express.Request,
    res: any,
    next: express.NextFunction
) {
    console.log(err)
    if ("status" in err) {
        return res.status(err.status).json({ message: err.message })
    }
    if (typeof err === "string") {
        // custom application error
        return res.status(400).json({ message: err })
    }

    if (err.name === "UnauthorizedError") {
        // jwt authentication error
        return res.status(401).json({ message: "Invalid Token" })
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message })
}
export default errorHandler
