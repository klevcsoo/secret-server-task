const NumericInput = (props: {
    value: number;
    onValueChanged(v: number): void;
    placeholder?: string;
    min?: number;
    max?: number;
}) => {
    return (
        <input type="number" value={ props.value } onChange={ (event) => {
            const newValue = parseInt(event.currentTarget.value);
            props.onValueChanged(isNaN(newValue) ? props.value : newValue);
        } } min={ props.min } max={ props.max } className={ `
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

export default NumericInput;
