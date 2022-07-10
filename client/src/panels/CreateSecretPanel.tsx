import {useSecret} from "../hooks";
import {useCallback, useState} from "react";
import {BasicButton, NumericInput, TextInput} from "../components";

const CreateSecretPanel = () => {
    const {createSecret} = useSecret();
    const [secret, setSecret] = useState("");
    const [expireAfter, setExpireAfter] = useState(0);
    const [expireAfterViews, setExpireAfterViews] = useState(1);
    const [loading, setLoading] = useState(false);

    const doCreateSecret = useCallback(() => {
        setLoading(true);
        createSecret({
            secret: secret, expireAfter: expireAfter, expireAfterViews: expireAfterViews
        }).then((hash) => {
            console.log("Hash:", hash);
        }).catch((err) => {
            console.error("Failed to create secret:", err);
        }).finally(() => setLoading(false));
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
        </div>
    );
};

export default CreateSecretPanel;
