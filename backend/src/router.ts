import express from "express";
import {join as joinPath} from "path";
import {allExists, writeLog} from "./utils";
import {createSecret, findSecret} from "./secrets";

const router = express.Router();

// Using JSON for POST requests
router.use(express.urlencoded());
router.use(express.json());

// Static files are served from the React build directory.
const staticDir = joinPath(__dirname, "../..", "client", "build");
writeLog("info", `Serving static files from ${staticDir}`);
router.use(express.static(staticDir));

// Any request coming through "/v1/secret/" is tested
// for its "Accept" header to see what type of media
// needs to be in the response
router.use("/v1/secret/", (request, response, next) => {
    const requestedType = request.header("accept");

    // If the "Accept" header is XML, the response
    // is in XML, however, if it's anything else,
    // the server responds with JSON
    if (requestedType === "application/xml") {
        response.setHeader("Content-Type", requestedType);
    } else response.setHeader("Content-Type", "application/json");

    next();
});

// POST request to "/v1/secret/"
// Through this, the client can request the creation
// of a new secret
router.post("/v1/secret/", async (request, response) => {
    writeLog("info", "Incoming request to create new secret...");

    if (!request.body) {
        response.sendStatus(406);
        writeLog("error", "Failed to create secret: Missing request body");
        return;
    }

    const secret = request.body["secret"] as string;
    const expiresAfter = request.body["expiresAfter"] as number;
    const allowedViews = request.body["allowedViews"] as number;

    if (!allExists(secret, expiresAfter, allowedViews) && expiresAfter !== 0) {
        response.sendStatus(406);
        writeLog("error", "Failed to create secret: Missing request args");
        return;
    }

    try {
        const hash = await createSecret({
            expiresInM: expiresAfter,
            allowedViews: allowedViews,
            text: secret
        });
        writeLog("info", `New secret created`);
        response.status(201).send({hash: hash});
    } catch (err) {
        writeLog("error", `Failed to create new secret: ${err}`);
        response.sendStatus(500);
    }
});

// GET request to "/v1/secret/:hash"
// Through this, the client can request to find
// an existing secret based on its hash
router.get("/v1/secret/:hash", async (request, response) => {
    writeLog("info", `Incoming request to find secret...`);

    const hash = request.params["hash"] as string;
    if (!hash) {
        response.sendStatus(406);
        writeLog("error", "Failed to find secret: Missing hash from request");
        return;
    }

    const findError = (err: any) => {
        writeLog("error", `Error while trying to find secret: ${err}`);
        if (err === "not-found") response.sendStatus(404);
        else response.sendStatus(500);
    };

    try {
        const secret = await findSecret(hash);
        if (!secret) {
            findError("not-found");
            return;
        }

        writeLog("info", "Secret found with given hash");
        response.status(200).send(secret);
    } catch (err) {
        findError(err);
    }
});

// Requests of any other types to any other endpoints
// will respond with the "404 Not Found" error message
router.all("/v1/*", (request, response) => {
    writeLog(
        "error",
        `Client requested missing API endpoint: ${request.path} (${request.method})`
    );
    response.sendStatus(404);
});

export default router;
