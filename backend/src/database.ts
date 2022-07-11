import {MongoClient} from "mongodb";
import {MONGODB_PWD, MONGODB_HOST, MONGODB_USER, DEV_ENV} from "./config";
import {writeLog} from "./utils";

writeLog("info", `Initializing MongoDB client... (${MONGODB_HOST})`);
let client;
try {
    const protocol = DEV_ENV ? "mongodb" : "mongodb+srv";
    const url = `${protocol}://${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_HOST}/secret-server`;
    client = new MongoClient(url);
} catch (err) {
    writeLog("error", `Init failed: ${err}`);
}

export async function initDatabase() {
    await client.connect();
}

export function database() {
    return client.db("secret-server");
}

export async function closeDatabase() {
    return client.close();
}
