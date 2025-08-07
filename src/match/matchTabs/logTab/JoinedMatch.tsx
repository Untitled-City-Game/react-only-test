import { PlayerData } from "@/scripts/types";
import Span from "@/src/userInterface/Span";


export function JoinedMatch({ senderData }: { senderData: PlayerData; }) {
	return (
		<>
			<Span fw="bold" fz={"md"}>{senderData.name}</Span> joined the
			match on the <Span fw="bold">{senderData.teamColor}</Span> team.
		</>
	);
}
