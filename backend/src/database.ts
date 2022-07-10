import {MongoClient} from "mongodb";
import {MONGODB_PWD, MONGODB_HOST, MONGODB_USER} from "./config";
import {writeLog} from "./utils";

writeLog("info", `Initializing MongoDB client... (${MONGODB_HOST})`);
let client;
try {
    const url = `mongodb://${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_HOST}/secret-server`;
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
