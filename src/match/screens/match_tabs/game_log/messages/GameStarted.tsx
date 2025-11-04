import { PlayerData } from "@/scripts/types/types";
import Span from "@/src/userInterface/Span";


export function GameStarted({ senderData }: { senderData: PlayerData; }) {
	return (
		<>
			<Span fw="bold">{senderData.name}</Span> started
			the game.
		</>
	);
}
