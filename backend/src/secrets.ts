import {database} from "./database";
import {writeLog} from "./utils";
import Cryptr from "cryptr";
import {randomBytes} from "crypto";

export type Secret = {
    hash: string // hash, using which the secret text is encoded and decoded
    secretText: string // the text itself
    createdAt: number // creation time in milliseconds (since UNIX epoch)
    expiresAt: number // expiration time in milliseconds (since UNIX epoch)
    remainingViews: number // remaining number of views
}

export async function findSecret(hash: string): Promise<Secret> {
    const collection = database().collection("secrets");
    const result: Secret = await collection.findOne({hash: hash});

    // If the secret expired, delete it from the database
    // and throw an error
    if (Date.now() > result.expiresAt && result.expiresAt !== 0) {
        collection.deleteOne({hash: hash});
        throw new Error("Secret expired");
    }

    // If the number of remaining views is less than one,
    // delete the secret and throw an error
    if (result.remainingViews < 1) {
        collection.deleteOne({hash: hash});
        throw new Error("Max amount of views reached");
    }

    // The encrypted text is replaced with the decrypted one
    // before sending the data back
    result.secretText = new Cryptr(hash).decrypt(result.secretText);

    // The default "_id" property that MongoDB adds to a document
    // is removed
    delete (result as any)["_id"];

    // In the database, the number of allowed views is decreased
    await collection.updateOne({hash: hash}, {
        $inc: {remainingViews: -1}
    });

    return result;
}

export async function createSecret(data: {
    text: string, expiresInM: number, allowedViews: number
}): Promise<string> {
    // Creating hash using the crypto module of node
    const hash = randomBytes(20).toString("hex");

    // Encrypting data with the third-party cryptr module
    // Trying to do the same thing with node's built-in
    // module kept giving mysterious errors
    const encryptedText = new Cryptr(hash).encrypt(data.text);
    const created = Date.now();
    const expires = (data.expiresInM === 0 ? 0 :
            created + (data.expiresInM * 60000) // now + minutes in milliseconds
    );

    const collection = database().collection("secrets");
    const result = await collection.insertOne({
        createdAt: created,
        hash: hash,
        secretText: encryptedText,
        remainingViews: data.allowedViews,
        expiresAt: expires
    } as Secret);

    if (result.acknowledged) {
        writeLog("info", `DB inserted doc ID: ${result.insertedId}`);
    } else {
        writeLog("error", "Error while inserting doc into collection");
    }

    return hash;
}
