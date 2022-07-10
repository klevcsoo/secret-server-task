import {BasicButton, TextInput} from "../components";
import {useCallback, useState} from "react";
import {useSecret} from "../hooks";

const FindSecretPanel = () => {
    const {findSecret} = useSecret();
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);

    const doFindSecret = useCallback(() => {
        setLoading(true);
        findSecret(hash).then((secret) => {
            console.log("Found secret:", secret);
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
        </div>
    );
};

export default FindSecretPanel;
