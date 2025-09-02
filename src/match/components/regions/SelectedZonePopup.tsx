import { ZoneData } from "@/scripts/games/connect_four/types";
import { GameContext } from "@/src/match/Board";
import ClaimFlowModal from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";
import { theme } from "@/src/styles/theme";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Button, Center, Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useContext } from "react";

export default function SelectedZonePopup({
	currentZone,
	setCurrentZone,
}: {
	currentZone: ZoneData | undefined;
	setCurrentZone: Dispatch<SetStateAction<ZoneData | undefined>>
}) {
	const [opened, { open, close }] = useDisclosure(false);
	const props = useContext(GameContext)
	return (
		<>
			<Center
				style={selectedZonePopupStyles}
				display={currentZone ? "initial" : "none"}>
				<Container style={selectedStyles} ta="center" bd={`2px solid ${theme.colors[props.playerData.data.teamColor][5]}`}>
						<Stack gap="xs">
						<P>
							<Span style={{
								margin: 0,
								padding: 0,
								fontWeight: "bold"
							}}>{currentZone?.name} </Span>
							<Span style={{
								margin: 0,
								padding: 0
							}}>{
							currentZone?.controlTeam !== null ? 
							`${currentZone?.locked ? 
								"Locked" : 
								"Held"
							} by ${currentZone?.controlTeam} team` : 
							"Unclaimed"
							}</Span>
						</P>
						<Button onClick={() => {
							open();
							setCurrentZone(undefined);
						}} size="m" disabled={currentZone?.locked}>
							<span>{currentZone?.controlTeam === null ? "Claim" : "Steal"}</span>
						</Button>
						</Stack>
				</Container>
			</Center>
			<ClaimFlowModal 
			open={opened}
			close={close}
			claimedZone={currentZone}
			/>
		</>
	);
}

const selectedStyles: React.CSSProperties = {
	padding: "1em",
	width: "min-content",
	minWidth: "70%",
	backgroundColor: "white",
	borderRadius: "5px",
};

const selectedZonePopupStyles: React.CSSProperties = {
	zIndex: 10,
	position: "absolute",
	bottom: 10,
	width: "100%",
};
