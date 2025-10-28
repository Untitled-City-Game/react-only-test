import { LogMetadata } from "@/scripts/types/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";


export function addLogMetadata({ log }: { log: LogAPI; }, metadata: LogMetadata) {
	console.log("add log metadata")
	log.setMetadata({ ...metadata, date: new Date().toString() });
}
