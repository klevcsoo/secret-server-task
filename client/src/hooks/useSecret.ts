import {Secret, SecretCreationRequestData} from "../types";
import {useCallback} from "react";

const DEV_ENV = process.env.DEV_ENV;
const secretServerUrl = !!DEV_ENV ?
    `${window.location.protocol}//${window.location.hostname}:5480`:
    `https://secret-api-klevcsoo.herokuapp.com`;

function useSecret(): {
    findSecret(hash: string): Promise<Secret>
    createSecret(data: SecretCreationRequestData): Promise<string>
} {
    const find = useCallback(async (hash: string) => {
        const res = await fetch(`${secretServerUrl}/v1/secret/${hash}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const body = await res.json();

        if (res.status !== 200) {
            throw new Error(body.message);
        }

        return body as Secret;
    }, []);

    const create = useCallback(async (data: SecretCreationRequestData) => {
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
