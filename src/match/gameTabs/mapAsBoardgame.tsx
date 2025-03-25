import { highlightColor } from "@/scripts/consts";
import { MetroGameBoardProps, ZoneData } from "@/scripts/types";
import { GameContext } from "@/src/match/Board";
import MapLine from "@/src/match/googleMaps/GoogleMapsLine";
import { VisGLMapTest } from "@/src/match/googleMaps/MapElement";
import SelectedZonePopup from "@/src/match/googleMaps/SelectedZonePopup";
import ZonePolygon from "@/src/match/googleMaps/ZonePolygon";
import Header from "@/src/userInterface/Header";
import { useContext, useState } from "react";

export default function MapBoard() {
	console.log("rendering mapboard")
	const props: MetroGameBoardProps = useContext(GameContext);
	//console.log("playerdata", props.G.allPlayersData);
	const { zonePolygons, winningLines, G } = props;
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
			<Header>
				<h1>Map</h1>
			</Header>
			<div style={mapContainerStyles}>
				<div id="map" style={mapStyles}>
					{/* <VisGlMapElement
						setLineVisibility={setLineVisibility}
						setHighlightedZones={setHighlightedZones}
						setCurrentZone={setCurrentZone}
						lineElements={lineElements}
						zoneElements={zoneElements} 
					/> */}
					<VisGLMapTest />
				</div>
				<SelectedZonePopup currentZone={currentZone} />
			</div>
		</>
	)
}
const mapStyles: React.CSSProperties = {
	flexBasis: "200px",
	flexGrow: 7,
};

const mapContainerStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	flexGrow: 10,
};
