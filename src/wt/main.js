import * as os from "os";

import {Worker} from "worker_threads";
import {fileURLToPath} from "url";
import path from "node:path";

const performCalculations = async () => {
    // Write your code here
    const cpus = os.cpus()
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename)
    const fullPath = path.join(__dirname, 'worker.js')
    let num = 10

    const workersCB = await Promise.all(cpus.map(() => {
        return new Promise((res, rej) => {
            const worker = new Worker(fullPath, {workerData: num++})
            worker.on("message", msg => res(msg))
            worker.on("error", msg => rej(msg))
        })
    }))

        const results = workersCB.map((result) =>
            ({
            status: typeof result === "number" ? 'resolved' : 'error',
            data: typeof result === "number" ? result : null,
        }))
    console.log(results)
        return results

    };

    await performCalculations();