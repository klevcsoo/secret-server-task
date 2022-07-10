/**
 * Print text in the form of info or error to the
 * default output.
 * @param type the type of the log
 * @param body the value to be logged as text
 */
export function writeLog(type: "info" | "error", body: any) {
    const timestamp = (() => {
        const raw = new Date();
        const d = raw.toDateString();
        const t = raw.toTimeString().substring(
            0, raw.toTimeString().indexOf(" ")
        );
        return `${d} ${t}`;
    })();
    switch (type) {
        case "info": {
            console.log(`[${timestamp}] INFO:`, body);
            break;
        }
        case "error": {
            console.error(`[${timestamp}] ERROR:`, body);
            break;
        }
        default: {
            console.log(`[${timestamp}]`, body);
            break;
        }
    }
}

/**
 * Checks whether all the arguments have values or not.
 * @param args the arguments to be checked
 */
export function allExists(...args: any[]): boolean {
    for (const a of args) if (!a) return false;
    return true;
}
