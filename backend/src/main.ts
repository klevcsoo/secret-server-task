import express from "express";
import cors from "cors";
import {EXPRESS_PORT} from "./config";
import {writeLog} from "./utils";

const app = express();
app.use(cors());

app.listen(EXPRESS_PORT, () => {
    writeLog(
        "info",
        `Express server listening to requests on port ${EXPRESS_PORT}`
    );
});

app.post("/v1/secret/", (request, response) => {
    writeLog("info", "Creating new secret");
    response.sendStatus(200);
});

app.get("/v1/secret/:hash", (request, response) => {
    const hash = request.params["hash"] as string;
    writeLog("info", `Finding secret with hash ${hash}`);
    response.sendStatus(200);
});

app.all("/v1/*", (request, response) => {
    writeLog(
        "error",
        `Client requested missing API endpoint: ${request.path} (${request.method})`
    );
    response.sendStatus(404);
});
