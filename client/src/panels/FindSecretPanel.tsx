import {useCallback, useState} from "react";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {BasicButton, TextInput} from "../components";
import {useSecret} from "../hooks";
import {Secret} from "../types";

const FindSecretPanel = () => {
    const {findSecret} = useSecret();
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState<Secret>();

    const doFindSecret = useCallback(() => {
        setLoading(true);
        findSecret(hash).then((secret) => {
            console.log("Found secret:", secret);
            setSecret(secret);
        }).catch((err) => {
            console.log("Failed to find secret:", err);
        }).finally(() => setLoading(false));
    }, [findSecret, hash]);

    return (
        <div className={"flex flex-col gap-8 max-w-lg"}>
            <div className={"flex flex-col"}>
                <TextInput type="text" value={hash} onValueChanged={setHash}
                           placeholder="Hash"/>
                <p>
                    The hash of the secret you are trying to find. Only using
                    this hash can the server can decrypt the secret text.
                </p>
            </div>
            <BasicButton text="Find" onClick={doFindSecret} loading={loading}/>
            {!secret ? null : (
                <div className={"flex flex-col gap-2 rounded-xl bg-slate-100 p-4"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h2 className={"text-xl font-bold"}>
                            Secret found!
                        </h2>
                        <button type="button" onClick={() => {
                            setSecret(undefined);
                            setHash("");
                        }}>
                            <CloseRounded color={"inherit"}/>
                        </button>
                    </div>
                    <p>
                        <b>Hash:</b><br/>
                        {secret.hash}<br/>
                        <b>Created at:</b><br/>
                        {new Date(secret.createdAt).toLocaleDateString()}{" "}
                        {new Date(secret.createdAt).toLocaleTimeString()}<br/>
                        <b>Expires at:</b><br/>
                        {!secret.expiresAt ? "Never" : (
                            new Date(secret.expiresAt).toLocaleDateString()
                            + " " +
                            new Date(secret.expiresAt).toLocaleTimeString()
                        )}<br/>
                        <b>Remaining views:</b><br/>
                        {secret.remainingViews}<br/>
                        <b>Content:</b><br/>
                        {secret.secretText}
                    </p>
                    {!!navigator["clipboard"] ? (
                        <BasicButton text="Copy raw response to clipboard" onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(secret)).then(() => {
                                console.log("Response copied to clipboard");
                            });
                        }}/>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default FindSecretPanel;
