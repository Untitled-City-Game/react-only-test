import { gameLocationCenters } from "@/scripts/consts";
import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { GameBoardContext, MatchTeamColor } from "@/scripts/types/types";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import MyLocationMarker from "@/src/match/googleMaps/MyLocationMarker";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import { GenericMapZones } from "@/src/match/screens/connect_four/GenericMapZones";
import P from "@/src/userInterface/P";
import { Box, Button, Container, Modal, Select, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useContext, useState } from "react";

export function StartingRegionButton({setStartDisabled} : {setStartDisabled: React.Dispatch<React.SetStateAction<boolean>>}) {
	const [opened, { open, close }] = useDisclosure(false);
	const connectFourContext = useContext(ConnectFourContext);

	return (
		<>
			<Button variant={connectFourContext.startingZone ? "light" : "outline"} onClick={open}>{connectFourContext.startingZone ? `Starting in: ${connectFourContext.startingZone}` : "Choose starting neighbourhood"}</Button>
			<StartingRegionModal opened={opened} close={close} setStartDisabled={setStartDisabled} />
		</>
	);
}

export function StartingRegionModal({
	opened,
	close,
	setStartDisabled
}: {
	opened: boolean;
	close: () => void;
	setStartDisabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const connectFourContext = useContext(ConnectFourContext);
	const gameContext = useContext(GameContext)
	const zoneSelectOptions = connectFourContext.zoneData.map(zone => { return { value: zone.name, label: zone.name } });
	const [selectedZone, setSelectedZone] = useState<string | null>("");
	const moves = gameContext.moves as ConnectFourMoves
	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			mah="70vh"
			title={
				<span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
					Select Starting Region
				</span>
			}>
				<Container style={{
					maxHeight: "90vh",
					overflowY: "scroll",
				}}>
					<Stack>
						<P>The starting neighbourhood cannot be claimed first. Both teams must leave the starting neighbourhood and claim another neighbourhood.</P>
						<Select label="Starting neighbourhood" data={zoneSelectOptions} value={selectedZone} onChange={setSelectedZone}/>
						<Box style={mapContainerStyle} >
							<VisGlMapElement center={gameLocationCenters[connectFourContext.city]}>
								<MyLocationMarker color={gameContext.playerData.data.teamColor} defaultLocation={gameLocationCenters[connectFourContext.city]} />
								<GenericMapZones 
									MapData={connectFourContext.MatchMapData} 
									selectedZone={selectedZone ?? ""} 
									onClick={(zoneName: string)=>setSelectedZone(zoneName)}
									/>
							</VisGlMapElement>
						</Box>
						<Button onClick={() => {
							setStartDisabled(false);
							moves.setStartingZone(selectedZone ?? "");
							close();
							}}>Confirm</Button>
					</Stack>
				</Container>
		</Modal>
	);
}

const mapContainerStyle : React.CSSProperties = {
	minHeight: "40vh",
	width: "100%",
	display: "flex",
	alignItems: "stretch",
	justifyContent: "stretch",
	position: "relative",
	height: 0,
}