import { LogMetadata } from "@/scripts/types/types";
import P from "@/src/userInterface/P";

export function ChatMessage({ metadata }: { metadata: LogMetadata }) {
	return (
		<P mb="0" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
			{metadata.chatText}
		</P>
	);
}
