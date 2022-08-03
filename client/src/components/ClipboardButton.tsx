import { useCallback, useEffect, useState } from "react";
import BasicButton from "./BasicButton";

const ClipboardButton = (props: {
  title: string;
  copyContent: string;
}) => {
  const [ actualTitle, setActualTitle ] = useState(props.title);
  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  const displayError = useCallback((msg: string) => {
    setActualTitle(msg);
    const timeoutId = setTimeout(() => setActualTitle(props.title), 1500);
    return () => { clearTimeout(timeoutId); };
  }, [ props.title ]);

  const displaySuccess = useCallback(() => {
    setSuccess(true);
    const timeoutId = setTimeout(() => setSuccess(false), 1500);
    return () => { clearTimeout(timeoutId); };
  }, []);

  useEffect(() => {
    setActualTitle((prev) => {
      if (prev === props.title) return prev;
      else return props.title;
    });
  }, [ props.title ]);

  return (
    <BasicButton text={ success ? "Copied ✅" : actualTitle } onClick={ () => {
      if (!navigator[ "clipboard" ]) displayError("Your browser doesn't support clipboards");
      else {
        setLoading(true);
        navigator.clipboard.writeText(props.copyContent).then(() => {
          displaySuccess();
        }).catch((err) => {
          displayError(err);
        }).finally(() => setLoading(false));
      }
    } } loading={ loading } />
  );
};

export default ClipboardButton;
