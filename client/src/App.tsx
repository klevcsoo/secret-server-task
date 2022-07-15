import {useState} from "react";
import {CreateSecretPanel, FindSecretPanel} from "./panels";
import {TabSwitcher} from "./components";
import {ReactComponent as AppLogo} from "./assets/logo-wide.svg";

function App() {
    const [creationPanel, setCreationPanel] = useState(true);

    return (
        <div className={"flex flex-col gap-8 items-center p-8"}>
            <AppLogo className={"max-w-full md:max-w-lg max-h-32"}/>
            <TabSwitcher tabTitles={["Create secret", "Find secret"]}
                         currentTabIndex={creationPanel ? 0 : 1}
                         onCurrentTabIndexChanged={(index) => {
                             setCreationPanel(!index);
                         }}/>
            {creationPanel ? <CreateSecretPanel/> : <FindSecretPanel/>}
            <p>
                2022 © made by{" "}
                <a href="https://github.com/klevcsoo" rel="noreferrer"
                   target="_blank">klevcsoo</a>
            </p>
        </div>
    );
}

export default App;
