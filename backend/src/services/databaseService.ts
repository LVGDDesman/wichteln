import mariadb from "mariadb";
import { User, UserData } from "../models/models";
import Authenticator from "./authenticatorService";
const config = require('../../config.json');

let instance: any;

class DataBase {
    dbHost: string;
    dbUser: string;
    dbPassword: string;
    pool: mariadb.Pool;
    database: any;
    
    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }
        instance = this;
            
        this.dbHost = config.db.host;
        this.dbUser = config.db.user;
        this.dbPassword = config.db.password;
        this.database = config.db.database;
        this.pool = mariadb.createPool({
            host: this.dbHost,
            user: this.dbUser,
            password: '' + this.dbPassword,
            database: this.database,
            connectionLimit: 5
        });


    }
    async userExists(username: string, email: string): Promise<boolean> {
        let con
        try {
            con = await this.pool.getConnection();

            const query = "SELECT COUNT(*) as count FROM user WHERE username = ? OR email = ?" 
            const rows = await con.query(query, [username, email]);
            return rows[0]["count"] != 0;
            
        } catch (e) {
            console.log(e);
            return true;
        } finally {
            if (con) con.release();
            
        }
    }

    async createUser(username: string, email: string, password: string) {
        let con;
        try {
            con = await this.pool.getConnection();
            const hash = Authenticator.hashPassword(password);
            const query = "INSERT INTO user value (0,?,?,?,NULL,NULL,NULL)";
            const rows = await con.query(query, [username, email, hash]);
            return Number(rows["insertId"]);
        } catch (e) {
            console.log(e);
            return 0;
        } finally {
            if (con) con.release();
            
        }
    }

    async getUser(email: string): Promise<User> {
        let con;
        try {
            con = await this.pool.getConnection();

            const query = "SELECT id, username, email, password FROM user WHERE email = ?";
            const result = await con.query(query, [email]);
            let user:User  = result[0];
            return user;
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            if (con) con.release();
            
        }
    }

    async getUserData(email: string): Promise<UserData> {
        let con;
        try {
            con = await this.pool.getConnection();

            const query = "SELECT * FROM user WHERE email = ?";
            const result = await con.query(query, [email]);
            let user:User  = result[0];
            return user;
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            if (con) con.release();
            
        }
    }
}


let DataBaseInstance = Object.freeze(new DataBase());

export default DataBaseInstance;