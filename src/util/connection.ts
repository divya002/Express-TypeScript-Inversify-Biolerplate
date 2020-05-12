import mongoose from "mongoose";
import { MONGODB_URI } from "./secrets";

export class DbConnection {
    public static async initConnection() {
        await DbConnection.connect(MONGODB_URI,);
    }

    public static async connect(connStr: string) {
       return mongoose.connect(
            connStr,
            {useNewUrlParser: true, useFindAndModify: false},
        )
            .then(() => {
                console.log(`Successfully connected to ${connStr}`);
            })
            .catch((error) => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    }

    public static setAutoReconnect() {
        mongoose.connection.on("disconnected", () => DbConnection.connect(process.env.DB_CONN_STR));
    }

    public static async disconnect() {
       await mongoose.connection.close();
    }
}
