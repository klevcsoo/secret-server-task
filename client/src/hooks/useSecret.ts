import {Secret, SecretCreationRequestData} from "../types";
import {useCallback} from "react";

const secretServerUrl = `${window.location.protocol}//${window.location.hostname}:5480`;

function useSecret(): {
    findSecret(hash: string): Promise<Secret>
    createSecret(data: SecretCreationRequestData): Promise<string>
} {
    const find = useCallback(async (hash: string) => {
        console.log(hash);
        return (await fetch(`${secretServerUrl}/v1/secret/${hash}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then((res) => res.json())) as Secret;
    }, []);

    const create = useCallback(async (data: SecretCreationRequestData) => {
        return (await fetch(`${secretServerUrl}/v1/secret/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()))["hash"] as string;
    }, []);

    return {
        createSecret: create,
        findSecret: find
    };
}

export default useSecret;
