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
