import express from "express";
import cors from "cors";
import {EXPRESS_PORT} from "./config";

const app = express();
app.use(cors());

app.listen(EXPRESS_PORT, () => {
    console.log(`Express server listening to requests on port ${EXPRESS_PORT}`);
});

app.post("/v1/secret/", (request, response) => {
    console.log("[TEST] Creating new secret");
    response.sendStatus(200);
});

app.get("/v1/secret/:hash", (request, response) => {
    const hash = request.params["hash"] as string;
    console.log(`[TEST] Finding secret with hash ${hash}`);
    response.sendStatus(200);
});
