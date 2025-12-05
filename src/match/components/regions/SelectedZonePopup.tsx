import { ZoneData } from "@/scripts/games/connect_four/types";
import { LineData } from "@/scripts/types/googleMaps";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import ClaimFlowModal, { isZoneDisabled } from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";
import Button from "@/src/userInterface/CustomButton";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Box, Center, CloseButton, Container, Group, Stack, useMantineTheme } from "@mantine/core";
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
	const theme = useMantineTheme();
	const [opened, { open, close }] = useDisclosure(false);
	const props = useContext(GameContext)
	const G = useContext(ConnectFourContext);
	const winningLines = G.MatchMapData.winningLines;
	const disabled = currentZone ? isZoneDisabled(currentZone.name, G) : false
	function deselect(){
		setCurrentZone(undefined);
		setActiveLine(undefined);
	}
	const ownerColor = currentZone?.controlTeam ? theme.colors[currentZone.controlTeam][5] : undefined
	return (
		<>
			<Center
				style={{
					borderTop: `3px solid ${ownerColor || theme.colors.actionColor[5]}`,
					...selectedZonePopupStyles
				}}
				display={currentZone ? "initial" : "none"}
			>
				<CloseButton 
					style={{
						position: "absolute",
						right: "1rem",
					}}
					onClick={deselect}
				/>
				<Stack gap="xs" w="100%" align="stretch">
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
					{disabled ?
						<P>
							You can't claim the starting neighbourhood first.
						</P> : null}
					<Button 
					color={ownerColor}
					onClick={() => {
						open();
						deselect();
					}} size="m" disabled={currentZone?.locked || disabled}>
						<span>{currentZone?.controlTeam === null ? "Claim" : currentZone?.controlTeam === props.playerData.data.teamColor ? "Lock" : "Steal"}</span>
					</Button>
					<LineStepper color={currentZone?.controlTeam || undefined} lines={winningLines.filter(line => line.matchedPolygons.includes(currentZone?.name || ""))} activeLine={activeLine} setActiveLine={setActiveLine} />
				</Stack>
			</Center>
			<ClaimFlowModal
				open={opened}
				close={close}
				claimedZone={currentZone}
			/>
		</>
	);
}

function LineStepper({ lines, activeLine, setActiveLine, color }: { lines: LineData[], activeLine: LineData | undefined, setActiveLine: Dispatch<SetStateAction<LineData | undefined>>, color?: string }) {
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
			setLineIndex(lines.length - 1)
			setActiveLine(lines[lines.length - 1])
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
				<Button color={color} onClick={prevLine}><FaArrowCircleLeft /></Button>
				<h3 style={{ margin: 0 }}>Line {lineIndex + 1} of {lines.length}</h3>
				<Button color={color} onClick={nextLine}><FaArrowCircleRight /></Button>
			</Group>
		</>
	)
}

const lineStartStyle: React.CSSProperties = {
	position: "absolute",
	top: "-11px",
	//left: "-10px",
	height: "1rem",
	width: "0.3rem",
	backgroundColor: "darkgrey"
}
const lineEndStyle: React.CSSProperties = {
	position: "absolute",
	top: "-11px",
	right: "0px",
	height: "1rem",
	width: "0.3rem",
	backgroundColor: "darkgrey"
}

const stationPointStyle: React.CSSProperties = {
	position: "absolute",
	top: "-10px",

}

const lineStyles: React.CSSProperties = {
	borderTop: "5px solid darkgrey",
	paddingTop: "8px",
	position: "relative"

}

const selectedStyles: React.CSSProperties = {
	margin: 0,
	width: "100%",
	backgroundColor: "white",
	// borderRadius: "5px",
	minHeight: "220px"
};

const selectedZonePopupStyles: React.CSSProperties = {
	zIndex: 1,
	position: "fixed",
	bottom: 0,
	width: "100%",
	backgroundColor: "white",
	textAlign: "center",
	padding: "0.5rem 1rem",
};
