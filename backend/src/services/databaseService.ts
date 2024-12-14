import mariadb from "mariadb"
import {
    externalUser,
    User,
    UserWithWichtelee,
    WichtelData,
    WichteleeData,
} from "../models/models"
const config = require("../config.json")

let instance: any

class DataBase {
    dbHost: string
    dbUser: string
    dbPassword: string
    pool: mariadb.Pool
    database: any

    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!")
        }
        instance = this

        this.dbHost = config.db.host
        this.dbUser = config.db.user
        this.dbPassword = config.db.password
        this.database = config.db.database
        this.pool = mariadb.createPool({
            host: this.dbHost,
            user: this.dbUser,
            password: "" + this.dbPassword,
            database: this.database,
            connectionLimit: 5,
        })
    }
    async close() {
        this.pool.end()
    }

    async userExists(
        username: string,
        email: string,
        id: Number = 0
    ): Promise<boolean> {
        let con
        try {
            con = await this.pool.getConnection()

            const query =
                "SELECT COUNT(*) as count FROM user WHERE username = ? OR email = ? AND id != ?"
            const rows = await con.query(query, [username, email, id])
            return rows[0]["count"] != 0
        } catch (e) {
            console.log(e)
            return true
        } finally {
            if (con) con.release()
        }
    }

    async createUser(username: string, email: string, hash: string) {
        let con
        try {
            con = await this.pool.getConnection()
            const query = "INSERT INTO user value (0,?,?,?,NULL,NULL,NULL)"
            const rows = await con.query(query, [username, email, hash])
            return Number(rows["insertId"])
        } catch (e) {
            console.log(e)
            return 0
        } finally {
            if (con) con.release()
        }
    }

    async updateUser(newUser: User) {
        let con
        try {
            con = await this.pool.getConnection()
            const query =
                "UPDATE user SET username = ?, email= ?, password = ? WHERE id = ?"
            const result = await con.query(query, [
                newUser.username,
                newUser.email,
                newUser.password,
                newUser.id,
            ])
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getUserById(id: Number): Promise<User> {
        let con
        try {
            con = await this.pool.getConnection()

            const query =
                "SELECT id, username, email, password FROM user WHERE id = ?"
            const result = await con.query(query, [id])
            let user: User = result[0]
            return user
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getUser(username: string): Promise<User> {
        let con
        try {
            con = await this.pool.getConnection()

            const query =
                "SELECT id, username, email, password FROM user WHERE username = ?"
            const result = await con.query(query, [username])
            let user: User = result[0]
            return user
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getUserData(id: Number): Promise<externalUser> {
        let con
        try {
            con = await this.pool.getConnection()

            const query = "SELECT email, username FROM user WHERE id = ?"
            const result = await con.query(query, [id])
            let user: User = result[0]
            return user
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async deleteUser(id: Number) {
        let con
        try {
            con = await this.pool.getConnection()
            const query = "DELETE FROM user WHERE id=?;"
            await con.query(query, [id])
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    // WichtelData
    async getWichtelData(id: Number): Promise<WichtelData> {
        let con
        try {
            con = await this.pool.getConnection()

            const query = "SELECT wish, address FROM user WHERE id = ?"
            const result = await con.query(query, [id])
            return result[0]
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async setWichtelData(id: Number, wichtelData: WichtelData) {
        let con
        try {
            con = await this.pool.getConnection()

            if (wichtelData.wish) {
                let query = "UPDATE user SET wish = ? WHERE id = ?"
                await con.query(query, [wichtelData.wish, id])
            }
            if (wichtelData.address) {
                let query = "UPDATE user SET address = ? WHERE id = ?"
                await con.query(query, [wichtelData.address, id])
            }
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getWichteleeData(id: Number): Promise<WichteleeData> {
        let con
        try {
            con = await this.pool.getConnection()

            const query =
                "SELECT a.wish, a.address, a.username from user as a inner join user as b on a.id = b.wichtelee where b.id = ?"
            const result = await con.query(query, [id])
            return result[0]
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getAllUsers(): Promise<User[]> {
        let con
        try {
            con = await this.pool.getConnection()

            const query = "SELECT id, username, email, password FROM user"
            const result = await con.query(query)
            let user: User[] = result
            return user
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async setWichtelees(users: UserWithWichtelee[]): Promise<void> {
        let con
        try {
            con = await this.pool.getConnection()
            const query = "UPDATE user SET wichtelee = ? WHERE id = ?"
            for (const user of users) {
                await con.query(query, [user.wichtelee, user.id])
            }
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }

    async getFirstUser(): Promise<UserWithWichtelee> {
        let con
        try {
            con = await this.pool.getConnection()

            const query = "SELECT id, username, email, wichtelee FROM user"
            const result = await con.query(query)
            let user: UserWithWichtelee = result[0]
            return user
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            if (con) con.release()
        }
    }
}
let DataBaseInstance = Object.freeze(new DataBase())

export default DataBaseInstance
