import { gameLocationCenters } from "@/scripts/consts";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import SelectedZonePopup from "@/src/match/components/regions/SelectedZonePopup";
import ZonePolygon from "@/src/match/components/regions/ZonePolygon";
import { useContext, useMemo, useRef, useState } from "react";
import { ConnectFourGameState, ZoneData } from "@/scripts/games/connect_four/types";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import AllTeamMarkers from "@/src/match/googleMaps/AllTeamMarkers";
import { LineData } from "@/scripts/types/googleMaps";
import MyLocationMarker from "@/src/match/googleMaps/MyLocationMarker";
import { isStartZoneClaimable } from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";

const DEBUG = false

export default function ConnectFourMapTab() {
	const { playerData } = useContext(GameContext)
	const G = useContext(ConnectFourContext);
	const [currentZone, setCurrentZone] = useState<ZoneData>();
	const [activeLine, setActiveLine] = useState<LineData | undefined>()
	// const [lineVisibility, setLineVisibility] = useState(
	// 	winningLines
	// 		? winningLines.reduce((acc, line) => {
	// 			acc[line.featureName] = false;
	// 			return acc;
	// 		}, {} as { [key: string]: boolean })
	// 		: {}
	// );

	// const [highlightedZones, setHighlightedZones] = useState(
	// 	zonePolygons
	// 		? zonePolygons.reduce((acc, zone) => {
	// 			acc[zone.featureName] = false;
	// 			return acc;
	// 		}, {} as { [key: string]: boolean })
	// 		: {}
	// );


	// const lineMemo = useMemo(() => processMetroLines(winningLines), [winningLines])

	// //Render zone lines
	// const lineElements = lineMemo.offsetLines.map((line, index) => {
	// 	return (
	// 		<MapLine
	// 			index={index}
	// 			line={line}
	// 			allLines={winningLines}
	// 			lineVisibility={activeLine?.featureName === line.featureName}
	// 			key={index}
	// 		/>
	// 	);
	// });

	//Render zone polygons
	const { zonePolygons, winningLines, city } = G.MatchMapData;
	const zoneElements = zonePolygons?.map((zone, index) => {
		const onClick = function (
			// lineVisibilityTemp: { [key: string]: boolean },
			// highlightedZonesTemp: { [key: string]: boolean }
		) {
			DEBUG && console.log("zone clicked", zone);
			// console.log("highlight zones", highlightedZonesTemp)
			DEBUG && console.log("current zone", currentZone)
			//check if already selected
			if(currentZone?.name === zone.featureName){
				setCurrentZone(undefined)
				setActiveLine(undefined)
				return;
			}
			//set line visibility
			// setLineVisibility(lineVisibilityTemp);
			setCurrentZone(G.zoneData[index]);
			setActiveLine(winningLines.filter(line => line.matchedPolygons.includes(G.zoneData[index]?.name || ""))[0])
		};
		const zoneDisabled = (zone.featureName === G.startingZone) && (!isStartZoneClaimable(G.zoneData))
		return (
			<ZonePolygon
				zone={zone}
				handleZoneClick={onClick}
				currentZone={currentZone}
				zoneGameData={G.zoneData[index]}
				key={index}
				activeLine={activeLine}
				disabled={zoneDisabled}
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
						setActiveLine(undefined);
						// setLineVisibility({});
						// setHighlightedZones({});
					}}
				>
					{/* <>{lineElements}</> */}
					{/* <>{overlapLineElements}</> */}
					{/* <>{connectionCirles}</> */}
					<>{zoneElements}</>
					<MyLocationMarker color={playerData.data.teamColor} defaultLocation={gameLocationCenters[G.city]} playerID={playerData.data.playerID} broadcast={true} />
					<AllTeamMarkers teamName={playerData.data.teamColor} />
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


export function createZoneElements(G: ConnectFourGameState){
	
}