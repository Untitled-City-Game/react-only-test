import { gameLocationCenters } from "@/scripts/consts";
import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import MyLocationMarker from "@/src/match/googleMaps/MyLocationMarker";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import { useMyZoneRef } from "@/src/match/interfaces/useMyZone";
import { GenericMapZones } from "@/src/match/screens/connect_four/GenericMapZones";
import P from "@/src/userInterface/P";
import { Box, Button, Container, Modal, Select, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useContext, useEffect, useState } from "react";

export function StartingRegionButton({setStartDisabled} : {setStartDisabled: React.Dispatch<React.SetStateAction<boolean>>}) {
	const [opened, { open, close }] = useDisclosure(false);
	const connectFourContext = useContext(ConnectFourContext);

	return (
		<>
			<Button variant={connectFourContext.startingZone ? "light" : "filled"} onClick={open}>{connectFourContext.startingZone ? `Starting in: ${connectFourContext.startingZone}` : "Choose starting neighbourhood"}</Button>
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
	const myZoneRef = useMyZoneRef()
	const [selectedZone, setSelectedZone] = useState<string | null>();

	useEffect(() => {
		console.log("opened starting region modal", myZoneRef.current)
		setSelectedZone(myZoneRef.current?.name)
	}, [opened]);

	const moves = gameContext.moves as ConnectFourMoves
	return (
		<Modal
			opened={opened}
			onClose={close}
			removeScrollProps={{ allowPinchZoom: true }}
			title={
				<span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
					Choose Starting Neighbourhood
				</span>
			}>
				<Container 	>
					<Stack gap="0.5rem">
						<div>
							<P fz="sm">The starting neighbourhood cannot be claimed first.</P>
							<P fz="sm">Teams must leave the starting neighbourhood, and claim another neighbourhood.</P>
						</div>
						<Select label="Starting neighbourhood" data={zoneSelectOptions} value={selectedZone} onChange={setSelectedZone}/>
						<Box style={mapContainerStyle} >
							<VisGlMapElement center={gameLocationCenters[connectFourContext.city]} gestureHandling="cooperative">
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