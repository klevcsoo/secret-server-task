import {useState} from "react";
import {CreateSecretPanel, FindSecretPanel} from "./panels";
import {TabSwitcher} from "./components";

function App() {
    const [creationPanel, setCreationPanel] = useState(true);

    return (
        <div className={"flex flex-col gap-8 items-center p-8"}>
            <TabSwitcher tabTitles={["Create secret", "Find secret"]}
                         currentTabIndex={creationPanel ? 0 : 1}
                         onCurrentTabIndexChanged={(index) => {
                             setCreationPanel(!index);
                         }}/>
            {creationPanel ? <CreateSecretPanel/> : <FindSecretPanel/>}
            <p>
                2022 © made by{" "}
                <a href="https://github.com/klevcsoo" target="_blank">klevcsoo</a>
            </p>
        </div>
    );
}

export default App;
