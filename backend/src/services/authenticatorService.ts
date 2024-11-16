import { User } from "../models/models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const config = require('../../config.json');

class Authenticator {

    static hashPassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(password, salt);
        return hash;
    }
    static authenticate(password: string, dbhash: string): boolean {
        return bcrypt.compareSync(password, dbhash);
    }


    static createJWT(id: string, email: string): string {
        const token = jwt.sign({ userId: id, email: email }, config.jwt.secret, {
            expiresIn: '7d', // Token expiration time
        });
        return token;

    }
}

export default Authenticator