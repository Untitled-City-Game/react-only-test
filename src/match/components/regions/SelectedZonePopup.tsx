import { ZoneData } from "@/scripts/games/connect_four/types";
import { LineData } from "@/scripts/types/googleMaps";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import ClaimFlowModal from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";
import { theme } from "@/src/styles/theme";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Button, Center, Container, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export default function SelectedZonePopup({
	currentZone,
	setCurrentZone,
	activeLine,
	setActiveLine
}: {
	currentZone: ZoneData | undefined;
	setCurrentZone: Dispatch<SetStateAction<ZoneData | undefined>>;
	activeLine: LineData | undefined;
	setActiveLine: Dispatch<SetStateAction<LineData | undefined>>;
}) {
	const [opened, { open, close }] = useDisclosure(false);
	const props = useContext(GameContext)
	const G = useContext(ConnectFourContext);
	const winningLines = G.MatchMapData.winningLines;
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
						<LineStepper lines={winningLines.filter(line => line.matchedPolygons.includes(currentZone?.name || ""))} activeLine={activeLine} setActiveLine={setActiveLine} />
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

function LineStepper({ lines, activeLine, setActiveLine }: { lines: LineData[], activeLine: LineData | undefined, setActiveLine: Dispatch<SetStateAction<LineData | undefined>> }) {
	const [lineIndex, setLineIndex] = useState(0);
	function nextLine() {
		if (lineIndex >= lines.length - 1) {
			setLineIndex(0)
			setActiveLine(lines[0])
		} else {
			setLineIndex(lineIndex + 1);
			setActiveLine(lines[lineIndex + 1])
		}
	}
	useEffect(() => {
		if (activeLine === undefined) { setActiveLine(lines[0]); }
	}, [lines])

	return (
		<>
		<h3 style={{margin: 0}}>Lines</h3>
		<Group wrap="nowrap" align="center" justify="space-between">
			<P fz="xs">{activeLine?.matchedPolygons.join(", ")}</P>
			<Button onClick={nextLine}>→</Button>
		</Group>
		</>
	)
}

const selectedStyles: React.CSSProperties = {
	padding: "1em",
	width: "min-content",
	minWidth: "90%",
	backgroundColor: "white",
	borderRadius: "5px",
};

const selectedZonePopupStyles: React.CSSProperties = {
	zIndex: 10,
	position: "absolute",
	bottom: 10,
	width: "100%",
};
