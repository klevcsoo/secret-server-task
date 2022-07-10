import {LoadingSpinner} from "./index";

const BasicButton = (props: {
    text: string
    onClick(): void
    loading?: boolean
}) => {
    return (
        <button type="button" onClick={() => props.onClick()}
                className={"w-full h-8 bg-blue-500 rounded-lg"}>
            {props.loading ? (
                <LoadingSpinner/>
            ) : (
                <span className={"text-white"}>{props.text}</span>
            )}
        </button>
    );
};

export default BasicButton;
