import { Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class Authenticator {

    static authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {
        return true;
    }
    
}

export default Authenticator