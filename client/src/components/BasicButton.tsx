import {LoadingSpinner} from "./index";

const BasicButton = (props: {
    text: string
    onClick(): void
    loading?: boolean
}) => {
    return (
        <button type="button" onClick={() => props.onClick()}
                className={"w-full h-8 bg-blue-500 rounded-lg disabled:bg-blue-400"}
                disabled={props.loading}>
            <span className={"text-white"}>
                {props.loading ? <LoadingSpinner/> : props.text}
            </span>
        </button>
    );
};

export default BasicButton;
