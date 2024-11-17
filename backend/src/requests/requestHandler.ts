import { Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Authenticator from "../services/authenticatorService";
import DataBaseInstance from "../services/databaseService";

class requestHandler {

    constructor() {
        //const emailHandler
    }


    static async getUserData(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: any): Promise<any> {
        const { id } = req.body;
        if (await DataBaseInstance.getUserData(id)) {
            res.status(400).json({ error: 'Not Found' });
        } else {
            res.status(500);
        }
    }

    static async addUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: any): Promise<any> {
        const { username, email, password} = req.body;
        if (await DataBaseInstance.userExists(username, email)) {
            res.status(401).json({ error: 'User exists' });
        } else {
            const userId = await DataBaseInstance.createUser(username, email, password);
            const token = Authenticator.createJWT(String(userId));
            res.status(201).json({ "id": userId, "username": username, "token": token });
            //res.status(201).json({"id": userId});
        }

    }
    static getWichtelee(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
    }
    static editUserData(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
    }
    static addWichtelData(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
    }
    static deleteUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
    }
}
export default requestHandler