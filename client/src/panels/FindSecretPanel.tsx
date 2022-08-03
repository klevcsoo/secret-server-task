import {useCallback, useState} from "react";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {BasicButton, BoolSwitcher, ClipboardButton, TextInput} from "../components";
import {useSecret} from "../hooks";
import {FindResult} from "../types";

const FindSecretPanel = () => {
    const {findSecret} = useSecret();
    const [hash, setHash] = useState("");
    const [xmlType, setXmlType] = useState(false)
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState<FindResult>();
    const [error, setError] = useState<string>();

    const doFindSecret = useCallback(() => {
        setSecret(undefined);
        setError(undefined);
        setLoading(true);
        setTimeout(() => {
            findSecret(hash, xmlType).then((result) => {
                console.log("Found secret:", result);
                setSecret(result);
            }).catch((err) => {
                console.log("Failed to find secret:", err);
                setError(err);
            }).finally(() => setLoading(false));
        }, 500);
    }, [findSecret, hash, xmlType]);

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
            <BoolSwitcher title="Get response as XML" checked={xmlType}
                          onCheckedChanged={setXmlType} />
            <BasicButton text="Find" onClick={doFindSecret} loading={loading}/>
            {!secret ? null : (
                <div className={`
                    flex flex-col gap-2 rounded-xl bg-slate-100 dark:bg-neutral-800 p-4
                `}>
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
                        {secret.obj.hash}<br/>
                        <b>Created at:</b><br/>
                        {new Date(secret.obj.createdAt).toLocaleDateString()}{" "}
                        {new Date(secret.obj.createdAt).toLocaleTimeString()}<br/>
                        <b>Expires at:</b><br/>
                        {!secret.obj.expiresAt ? "Never" : (
                            new Date(secret.obj.expiresAt).toLocaleDateString()
                            + " " +
                            new Date(secret.obj.expiresAt).toLocaleTimeString()
                        )}<br/>
                        <b>Remaining views:</b><br/>
                        {secret.obj.remainingViews}<br/>
                        <b>Content:</b><br/>
                        {secret.obj.secretText}
                    </p>
                    {!!navigator["clipboard"] ? (
                        <ClipboardButton title="Copy raw response to clipboard"
                                         copyContent={secret.raw} />
                    ) : null}
                </div>
            )}
            {!error ? null : (
                <div className={"flex flex-col gap-2 rounded-xl bg-red-100 dark:bg-red-900 p-4"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h2 className={"text-xl font-bold"}>
                            Error!
                        </h2>
                        <button type="button" onClick={() => {
                            setError(undefined);
                            setHash("");
                        }}>
                            <CloseRounded color={"inherit"}/>
                        </button>
                    </div>
                    <p>{String(error).replaceAll("Error: ", "")}</p>
                </div>
            )}
        </div>
    );
};

export default FindSecretPanel;
