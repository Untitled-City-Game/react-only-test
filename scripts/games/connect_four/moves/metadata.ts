import { LogMetadata } from "@/scripts/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";


export function addLogMetadata({ log }: { log: LogAPI; }, metadata: LogMetadata) {
	log.setMetadata({ ...metadata, date: new Date().toString() });
}
