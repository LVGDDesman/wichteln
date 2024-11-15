import { Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import DataBaseInstance from "../services/databaseService";
import { User } from "../models/models";
import Properties from "./propertiesService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class Authenticator {

    static secretKey: string = Properties.get("jwt.secret");

    static hashPassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(password, salt);
        return hash;
    }
    static authenticate(password: string, dbhash: string): boolean {
        return bcrypt.compareSync(password, dbhash);
    }


    static createJWT(id: string, email: string): string {
        const token = jwt.sign({ userId: id, email: email }, this.secretKey, {
            expiresIn: '1h', // Token expiration time
        });
        return token;

    }

    static authenticateToken(authHeader: string) {
        const token = authHeader && authHeader.split(' ')[1]

        jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
            console.log(err)

            if (err) return "";
            return user;
        })
    }
}

export default Authenticator