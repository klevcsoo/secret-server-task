import express from "express";
import cors from "cors";
import {EXPRESS_PORT} from "./config";

function logWithTime(type: "info" | "error", body: any) {
    const timestamp = (() => {
        const raw = new Date();
        const d = raw.toDateString();
        const t = raw.toTimeString().substring(
            0, raw.toTimeString().indexOf(" ")
        );
        return `${d} ${t}`;
    })();
    switch (type) {
        case "info": {
            console.log(`[${timestamp}] INFO:`, body);
            break;
        }
        case "error": {
            console.error(`[${timestamp}] ERROR:`, body);
            break;
        }
        default: {
            console.log(`[${timestamp}]`, body);
            break;
        }
    }
}

const app = express();
app.use(cors());

app.listen(EXPRESS_PORT, () => {
    logWithTime(
        "info",
        `Express server listening to requests on port ${EXPRESS_PORT}`
    );
});

app.post("/v1/secret/", (request, response) => {
    logWithTime("info", "Creating new secret");
    response.sendStatus(200);
});

app.get("/v1/secret/:hash", (request, response) => {
    const hash = request.params["hash"] as string;
    logWithTime("info", `Finding secret with hash ${hash}`);
    response.sendStatus(200);
});
