import { Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class requestHandler {

    constructor() {
        //const emailHandler
        //const dataBaseHandler 
    }


    static getUserData(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        
        return [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
          ];
    }

    static addUser(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
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
    static login(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        throw new Error("Method not implemented.");
    }
}
export default requestHandler