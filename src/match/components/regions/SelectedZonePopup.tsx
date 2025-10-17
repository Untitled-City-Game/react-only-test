import { ZoneData } from "@/scripts/games/connect_four/types";
import { LineData } from "@/scripts/types/googleMaps";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import ClaimFlowModal from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";
import { theme } from "@/src/styles/theme";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Box, Button, Center, Container, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaCircle, FaGripLinesVertical, FaRegCircle } from "react-icons/fa";

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
						<LineStepper allZoneData={G.zoneData} lines={winningLines.filter(line => line.matchedPolygons.includes(currentZone?.name || ""))} activeLine={activeLine} setActiveLine={setActiveLine} />
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

function LineStepper({ lines, activeLine, setActiveLine, allZoneData }: { lines: LineData[], activeLine: LineData | undefined, setActiveLine: Dispatch<SetStateAction<LineData | undefined>>, allZoneData: ZoneData[] }) {
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
	function prevLine() {
		if (lineIndex == 0) {
			setLineIndex(lines.length -1)
			setActiveLine(lines[lines.length -1])
		} else {
			setLineIndex(lineIndex - 1);
			setActiveLine(lines[lineIndex - 1])
		}
	}
	useEffect(() => {
		if (activeLine === undefined) { setActiveLine(lines[0]); }
	}, [lines])

	return (
		<>
		<Group wrap="nowrap" align="center" justify="center">
		<Button onClick={prevLine}><FaArrowCircleLeft /></Button>
		<h3 style={{margin: 0}}>Line {lineIndex+1} of {lines.length}</h3>
		<Button onClick={nextLine}><FaArrowCircleRight /></Button>
		</Group>
		<Group wrap="nowrap" align="flex-start" justify="space-between" style={lineStyles}>
			<div style={lineStartStyle} color="darkgrey"/>
			{activeLine?.matchedPolygons.map((polygonName, index) =>
				<Stack key={index} align="center">
					<FaCircle style={stationPointStyle} color={allZoneData.find(zone => zone.name === polygonName)?.controlTeam || "white"} />
					<FaRegCircle style={stationPointStyle}/>
					<P fz="xs" >{polygonName}</P>
				</Stack>
			)}
			<div style={lineEndStyle} />
		</Group>
		
		</>
	)
}

const lineStartStyle : React.CSSProperties = {
	position: "absolute",
	top: "-11px",
	//left: "-10px",
	height: "1rem",
	width: "0.3rem",
	backgroundColor: "darkgrey"
}
const lineEndStyle : React.CSSProperties = {
	position: "absolute",
	top: "-11px",
	right: "0px",
	height: "1rem",
	width: "0.3rem",
	backgroundColor: "darkgrey"
}

const stationPointStyle : React.CSSProperties = {
	position: "absolute",
	top: "-10px",

}

const lineStyles : React.CSSProperties = {
	borderTop: "5px solid darkgrey",
	paddingTop: "8px",
	position: "relative"
	
}

const selectedStyles: React.CSSProperties = {
	padding: "0.5rem 1rem",
	width: "90%",
	backgroundColor: "white",
	borderRadius: "5px",
	minHeight: "220px"
};

const selectedZonePopupStyles: React.CSSProperties = {
	zIndex: 10,
	position: "absolute",
	bottom: 10,
	width: "100%",
};
