import {useSecret} from "../hooks";
import {useCallback, useState} from "react";
import {BasicButton, NumericInput, TextInput} from "../components";
import CloseRounded from "@mui/icons-material/CloseRounded";

const CreateSecretPanel = () => {
    const {createSecret} = useSecret();
    const [secret, setSecret] = useState("");
    const [expireAfter, setExpireAfter] = useState(0);
    const [expireAfterViews, setExpireAfterViews] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState<string>();
    const [error, setError] = useState<string>();

    const doCreateSecret = useCallback(() => {
        setHash(undefined);
        setError(undefined);
        setLoading(true);
        setTimeout(() => {
            if (!secret) {
                setError("Missing secret");
                setLoading(false);
                return;
            }

            createSecret({
                secret: secret, expireAfter: expireAfter, expireAfterViews: expireAfterViews
            }).then((hash) => {
                console.log("Hash:", hash);
                setHash(hash);
            }).catch((err) => {
                console.error("Failed to create secret:", err);
                setError(err);
            }).finally(() => setLoading(false));
        }, 500);
    }, [createSecret, secret, expireAfter, expireAfterViews]);

    return (
        <div className={"flex flex-col gap-8 max-w-lg"}>
            <div className={"flex flex-col"}>
                <TextInput type={"text"} value={secret} onValueChanged={setSecret}
                           placeholder="Secret text"/>
                <p>The content of the secret to be encrypted.</p>
            </div>
            <div className={"flex flex-col"}>
                <NumericInput min={0} value={expireAfter} onValueChanged={setExpireAfter}
                              placeholder="Expire after X minutes"/>
                <p>
                    The amount of minutes the secret will be valid for. After this
                    time, the secret will expire and be deleted.
                    Put 0 here to make it valid indefinitely.
                </p>
            </div>
            <div className={"flex flex-col"}>
                <NumericInput min={1} value={expireAfterViews}
                              onValueChanged={setExpireAfterViews}
                              placeholder="Expire after X views"/>
                <p>
                    The number of times the secret can be requested to be viewed
                    from the server. The minimum amount is 1.
                </p>
            </div>
            <BasicButton text="Create" onClick={doCreateSecret} loading={loading}/>
            {!hash ? null : (
                <div className={"flex flex-col gap-2 rounded-xl bg-slate-100 p-4"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h2 className={"text-xl font-bold"}>
                            New secret created!
                        </h2>
                        <button type="button" onClick={() => {
                            setError(undefined);
                            setHash(undefined);
                            setSecret("");
                            setExpireAfter(0);
                            setExpireAfterViews(1);
                        }}>
                            <CloseRounded color={"inherit"}/>
                        </button>
                    </div>
                    <p>
                        <b>Hash:</b><br/>
                        {hash}<br/>
                    </p>
                    {!!navigator["clipboard"] ? (
                        <BasicButton text="Copy hash to clipboard" onClick={() => {
                            navigator.clipboard.writeText(hash).then(() => {
                                console.log("Response copied to clipboard");
                            });
                        }}/>
                    ) : null}
                </div>
            )}
            {!error ? null : (
                <div className={"flex flex-col gap-2 rounded-xl bg-red-100 p-4"}>
                    <div className={"flex flex-row items-center justify-between"}>
                        <h2 className={"text-xl font-bold"}>
                            Error!
                        </h2>
                        <button type="button" onClick={() => {
                            setError(undefined);
                            setHash(undefined);
                            setSecret("");
                            setExpireAfter(0);
                            setExpireAfterViews(1);
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

export default CreateSecretPanel;
