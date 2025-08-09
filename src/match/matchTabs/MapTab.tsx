import { highlightColor } from "@/scripts/consts";
import { MetroGameBoardProps, ZoneData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import useTeamLocations from "@/src/match/boardGame/useTeamLocations";
import MapLine from "@/src/match/googleMaps/GoogleMapsLine";
import VisGlMapElement from "@/src/match/googleMaps/MapElement";
import SelectedZonePopup from "@/src/match/googleMaps/SelectedZonePopup";
import ZonePolygon from "@/src/match/googleMaps/ZonePolygon";
import StatusBar from "@/src/userInterface/StatusBar";
import { useContext, useState } from "react";

export default function MapTab() {
	console.log("rendering mapboard");
	const props: MetroGameBoardProps = useContext(GameContext);
	const G = props.G;
	const { zonePolygons, winningLines, city } = G.MatchMapData;

	const [lineVisibility, setLineVisibility] = useState(
		winningLines
			? winningLines.reduce((acc, line) => {
					acc[line.featureName] = false;
					return acc;
			  }, {} as { [key: string]: boolean })
			: {}
	);

	const [highlightedZones, setHighlightedZones] = useState(
		zonePolygons
			? zonePolygons.reduce((acc, zone) => {
					acc[zone.featureName] = false;
					return acc;
			  }, {} as { [key: string]: boolean })
			: {}
	);

	const [currentZone, setCurrentZone] = useState<ZoneData>();


	//Render zone lines
	const lineElements = winningLines.map((line, index) => {
		return (
			<MapLine
				index={index}
				line={line}
				lineVisibility={lineVisibility[line.featureName]}
				key={index}
			/>
		);
	});

	//Render zone polygons
	const zoneElements = zonePolygons?.map((zone, index) => {
		const onClick = function (
			lineVisibilityTemp: { [key: string]: boolean },
			highlightedZonesTemp: { [key: string]: boolean }
		) {
			console.log("zone clicked", zone);
			//set line visibility
			setLineVisibility(lineVisibilityTemp);
			setHighlightedZones(highlightedZonesTemp);
			setCurrentZone(G.zoneData[index]);
		};
		return (
			<ZonePolygon
				zone={zone}
				handleZoneClick={onClick}
				currentZone={currentZone}
				highlightedZones={highlightedZones}
				highlightColor={highlightColor}
				zoneGameData={G.zoneData[index]}
				key={index}
			/>
		);
	});

	return (
		<>
			<StatusBar />
			{/* <Header color={props.playerData.data.teamColor}>
			Map
			</Header> */}
			<div id="map" style={mapStyles}>
			<SelectedZonePopup currentZone={currentZone} setCurrentZone={setCurrentZone}/>
			<VisGlMapElement
				setLineVisibility={setLineVisibility}
				setHighlightedZones={setHighlightedZones}
				setCurrentZone={setCurrentZone}
				lineElements={lineElements}
				zoneElements={zoneElements} 
				city={city}
			/>
			</div>
		</>
	)
}
const mapStyles: React.CSSProperties = {
	flexGrow: 10,
	position: "relative",
	userSelect: "none",
	//flexShrink: 7,
};

