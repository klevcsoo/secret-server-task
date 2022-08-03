import {FindResult, Secret, SecretCreationRequestData} from "../types";
import {useCallback} from "react";
import { xml2js } from "xml-js";

const DEV_ENV = process.env.DEV_ENV;
const secretServerUrl = !!DEV_ENV ?
    `${window.location.protocol}//${window.location.hostname}:5480`:
    `https://secret-api-klevcsoo.herokuapp.com`;

type HookReturnValue = {
    findSecret(hash: string, xmlType: boolean): Promise<FindResult>;
    createSecret(data: SecretCreationRequestData): Promise<string>;
}

function xmlObjToSecret(obj: any): Secret {
    let out: any = {};
    for (const prop of obj["elements"][0]["elements"]) {
        out[prop["name"]] = prop["elements"][0]["text"];
    }
    return out as Secret;
}

function useSecret(): HookReturnValue {
    const find = useCallback<HookReturnValue["findSecret"]>(async (hash, xmlType) => {
        const res = await fetch(`${secretServerUrl}/v1/secret/${hash}`, {
            method: "GET",
            headers: {
                "Accept": `application/${xmlType ? "xml" : "json"}`
            }
        });

        if (res.status !== 200) {
            throw new Error((await res.json()).message);
        }

        const text = await res.text();
        const body: Secret = xmlType ? xmlObjToSecret(xml2js(text, {
            alwaysChildren: true,
            nativeType: true
        })) : JSON.parse(text)

        return {
            raw: text,
            obj: body,
            xml: xmlType
        } as FindResult
    }, []);

    const create = useCallback<HookReturnValue["createSecret"]>(async (data) => {
        const res = await fetch(`${secretServerUrl}/v1/secret/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const body = await res.json();

        if (res.status !== 201) {
            throw new Error(body.message);
        }

        return body.hash as string;
    }, []);

    return {
        createSecret: create,
        findSecret: find
    };
}

export default useSecret;
