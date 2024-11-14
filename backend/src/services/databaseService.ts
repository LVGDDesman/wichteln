import mariadb from "mariadb";
import Properties from "./propertiesService";

class DataBase {
    dbHost: string;
    dbUser: string;
    dbPassword: string;
    pool: mariadb.Pool;

    
    constructor() {
        this.dbHost = Properties.get("db.host");
        this.dbUser = Properties.get("db.user");
        this.dbPassword = Properties.get("db.password");
        this.pool = mariadb.createPool({
            host: this.dbHost, 
            user: this.dbUser, 
            password: this.dbPassword,
            connectionLimit: 5
        });
    }

}

export default DataBase