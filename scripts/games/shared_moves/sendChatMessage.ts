import { GameStateUniversal, MoveContext } from "@/scripts/types/types";
import { addLogMetadata } from "./metadata";

export const CHAT_MESSAGE_MAX_LENGTH = 500;

export function sendChatMessage<GameState extends GameStateUniversal>(
	context: MoveContext<GameState>,
	text: string,
) {
	const { G, log, playerID } = context;
	const trimmed = typeof text === "string" ? text.trim() : "";
	if (!trimmed || trimmed.length > CHAT_MESSAGE_MAX_LENGTH) return "INVALID_MOVE";
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[playerID].teamColor, chatText: trimmed },
	);
}
