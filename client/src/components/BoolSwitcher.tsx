import { useMemo } from "react";

const BoolSwitcher = (props: {
  title: string;
  checked: boolean;
  onCheckedChanged(newChecked: boolean): void;
}) => {
  const name = useMemo(() => {
    return `checkbox-${Date.now()}`
  }, [])

  return (
    <div className="flex flex-row gap-4 items-center">
      <label htmlFor={name}>
        {props.title}
      </label>
      <input type="checkbox" name={name} className="w-5 h-5" checked={props.checked}
      onChange={(event) => props.onCheckedChanged(event.currentTarget.checked)} />
    </div>
  )
}

export default BoolSwitcher
