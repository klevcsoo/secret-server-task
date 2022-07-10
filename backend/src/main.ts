import express from "express";
import cors from "cors";
import {EXPRESS_PORT} from "./config";
import {writeLog} from "./utils";
import {closeDatabase, initDatabase} from "./database";
import router from "./router";

const app = express();

// Using CORS for compatibility with other sites
app.use(cors());

// Enable custom router
app.use("/", router);

// Exit handler
["exit", "SIGINT", "uncaughtException", "SIGTERM"].forEach((type) => {
    process.on(type, () => {
        closeDatabase().then(() => {
            process.exit(0);
        }).catch((err) => {
            writeLog("error", `Failed to disconnect from database: ${err}`);
            process.exit(1);
        });
    });
});

// Express server startup and connection to the MongoDB
// server (I choose MongoDB because I'm familiar with
// document-based databases thanks to Cloud Firestore
// which is part of the Firebase package)
app.listen(EXPRESS_PORT, () => {
    writeLog(
        "info",
        `Express server listening to requests on port ${EXPRESS_PORT}`
    );
    writeLog("info", "Connecting to MongoDB server...");
    initDatabase().then(() => {
        writeLog("info", "Connected!");
    }).catch((err) => {
        writeLog("error", `Connection to MongoDB refused: ${err}`);
    });
});
