import { ZoneData } from "@/scripts/types";
import ClaimFlowModal from "@/src/match/claim/ClaimFlowModal";
import P from "@/src/userInterface/P";
import { Button, Center, Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";

export default function SelectedZonePopup({
	currentZone,
	setCurrentZone,
}: {
	currentZone: ZoneData | undefined;
	setCurrentZone: Dispatch<SetStateAction<ZoneData | undefined>>
}) {
	const [opened, { open, close }] = useDisclosure(false);
	console.log("selected zone popup", currentZone);
	return (
		<>
			<Center
				style={selectedZonePopupStyles}
				display={currentZone ? "initial" : "none"}>
				<Container style={selectedStyles} ta="center">
						<Stack gap="xs">
						<h2 style={{
							margin: 0
						}}>{currentZone?.name}</h2>
						<P style={{
							margin: 0
						}}>{
						currentZone?.controlTeam !== null ? 
						`${currentZone?.locked ? 
							"Locked" : 
							"Held"
						} by ${currentZone?.controlTeam} team` : 
						"Unclaimed"
						}</P>
						<Button onClick={() => {
							open();
							setCurrentZone(undefined);
						}} size="lg" disabled={currentZone?.locked}>
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
	border: "2px solid black"
};

const selectedZonePopupStyles: React.CSSProperties = {
	zIndex: 10,
	position: "absolute",
	bottom: 10,
	width: "100%",
};
