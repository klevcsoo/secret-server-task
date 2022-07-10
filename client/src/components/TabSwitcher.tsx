const TabSwitcher = (props: {
    tabTitles: string[]
    currentTabIndex: number
    onCurrentTabIndexChanged(index: number): void
}) => {
    return (
        <div className={`
        max-w-md min-w-max w-full p-2
        flex flex-row gap-2 items-center justify-evenly
        bg-slate-100 rounded-xl
        `}>
            {props.tabTitles.map((title, i) => (
                <h3 key={i} onClick={() => props.onCurrentTabIndexChanged(i)}
                    className={`
                    h-min w-full p-2 text-center
                    ${props.currentTabIndex === i ?
                        "font-bold bg-blue-500 text-white" :
                        "hover:bg-slate-200"
                    }
                    cursor-pointer rounded-xl
                    `}>
                    {title}
                </h3>
            ))}
        </div>
    );
};

export default TabSwitcher;
