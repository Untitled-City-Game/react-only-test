import { cities, gameLocationCenters, highlightColor } from "@/scripts/consts";
import { GameBoardContext, GameBoardContextSpecific } from "@/scripts/types/types";
import MapLine from "@/src/match/googleMaps/GoogleMapsLine";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import SelectedZonePopup from "@/src/match/components/regions/SelectedZonePopup";
import ZonePolygon from "@/src/match/components/regions/ZonePolygon";
import { useContext, useMemo, useRef, useState } from "react";
import { ConnectFourGameState, ZoneData } from "@/scripts/games/connect_four/types";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import AllTeamMarkers from "@/src/match/googleMaps/AllTeamMarkers";
import { processMetroLines } from "@/src/match/googleMaps/offsets";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import ConnectionMarker from "@/src/match/googleMaps/ConnectionMarker";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import ConnectedSegment from "@/src/match/googleMaps/ConnectedSegment";
import { LineData } from "@/scripts/types/googleMaps";

export default function ConnectFourMapTab() {
	const { playerData } = useContext(GameContext)
	const G = useContext(ConnectFourContext);
	const { zonePolygons, winningLines, city } = G.MatchMapData;
	const myLocation = useMyLocation(true, playerData.data.teamColor, gameLocationCenters[city] || { lat: 0, lng: 0 });
	const [activeLine, setActiveLine] = useState<LineData | undefined>()
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

	const lineMemo = useMemo(() => processMetroLines(winningLines), [winningLines])

	//Render zone lines
	const lineElements = lineMemo.offsetLines.map((line, index) => {
		return (
			<MapLine
				index={index}
				line={line}
				allLines={winningLines}
				lineVisibility={activeLine?.featureName === line.featureName}
				key={index}
			/>
		);
	});
	//Render overlap lines
	// const overlapLineElements = lineMemo.lineOverlaps.map((line, index) => {
	// 	return (
	// 		<ConnectedSegment key={index} overlap={line} visibility={line.lines.map(line => lineVisibility[line.featureName] ?? false)} />
	// 	)
		
	// });

	// //render vertex node circles
	// const connectionCirles = lineRef.current.connectionPoints.map((point, index) => {
	// 	const isVisible = point.lineNames.every((lineName) => lineVisibility[lineName])
	// 	return (
	// 		<ConnectionMarker 
	// 			point={point}
	// 			index={index}
	// 			lineVisibility={isVisible}
	// 		/>
	// 	)
	// })

	//Render zone polygons
	const zoneElements = zonePolygons?.map((zone, index) => {
		const onClick = function (
			lineVisibilityTemp: { [key: string]: boolean },
			highlightedZonesTemp: { [key: string]: boolean }
		) {
			console.log("zone clicked", zone);
			console.log("highlight zones", highlightedZonesTemp)
			console.log("current zone", currentZone)
			//check if already selected
			if(currentZone?.name === zone.featureName){
				console.log("zones match")
				const localWinningLines = winningLines.filter(line => line.matchedPolygons.includes(G.zoneData[index]?.name || ""))
				let currentLineIndex = localWinningLines.findIndex(line => line.featureName === activeLine?.featureName);
				console.log("current line index", currentLineIndex)
				currentLineIndex += 1;
				if(currentLineIndex >= winningLines.length){
					currentLineIndex = 0;
				}
				setActiveLine(localWinningLines[currentLineIndex])
				return;
			}
			//set line visibility
			setLineVisibility(lineVisibilityTemp);
			setHighlightedZones(highlightedZonesTemp);
			setCurrentZone(G.zoneData[index]);
			setActiveLine(winningLines.filter(line => line.matchedPolygons.includes(G.zoneData[index]?.name || ""))[0])
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
				activeLine={activeLine}
			/>
		);
	});
	return (
		<>
			{/* <Header color={props.playerData.data.teamColor}>
			Map
			</Header> */}
			<div id="map" style={mapStyles}>
				<SelectedZonePopup currentZone={currentZone} setCurrentZone={setCurrentZone} activeLine={activeLine} setActiveLine={setActiveLine}/>
				<VisGlMapElement
					center={gameLocationCenters[G.city]}
					onClick={() => {
						console.log("map clicked!")
						setCurrentZone(undefined);
						setLineVisibility({});
						setHighlightedZones({});
					}}
				>
					<>{lineElements}</>
					{/* <>{overlapLineElements}</> */}
					{/* <>{connectionCirles}</> */}
					<>{zoneElements}</>
					<LocationMarker position={myLocation} color={playerData.data.teamColor} />
					<AllTeamMarkers />
				</VisGlMapElement>
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

