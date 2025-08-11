import { PlayerData } from "@/scripts/types";
import Span from "@/src/userInterface/Span";


export function DiscardHand({ senderData }: { senderData: PlayerData; }) {
	return (
		<>
			<Span fw="bold">{senderData.teamColor} team</Span> discarded their hand of challenges.
		</>
	);
}
