import {ReactComponent as Loader} from "../assets/loader.svg";

const LoadingSpinner = () => {
    return (
        <div className={"h-8 w-8 m-auto"}>
            <Loader/>
        </div>
    );
};

export default LoadingSpinner;
