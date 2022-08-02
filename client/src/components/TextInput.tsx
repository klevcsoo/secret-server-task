import { HTMLInputTypeAttribute } from "react";

const TextInput = (props: {
    type: HTMLInputTypeAttribute;
    value: string;
    onValueChanged(v: string): void;
    placeholder?: string;
}) => {
    return (
        <input type={ props.type } value={ props.value } onChange={ (event) => {
            props.onValueChanged(event.currentTarget.value);
        } } className={ `
            w-full px-2 h-8 text-md
            rounded-lg bg-slate-100
            hover:bg-slate-200 
            focus:border-2 focus:border-blue-500
            focus:outline-none focus:bg-white
            dark:bg-neutral-800 dark:hover:bg-neutral-800
            dark:focus:bg-black
        `} placeholder={ props.placeholder } />
    );
};

export default TextInput;
