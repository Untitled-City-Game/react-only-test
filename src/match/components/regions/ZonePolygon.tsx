import { ZoneData } from "@/scripts/games/connect_four/types";
import { LineData, PolyData } from "@/scripts/types/googleMaps";
import { Color } from "@/scripts/types/types";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";
import { theme } from "@/src/styles/theme";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import polylabel from "polylabel";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

type ZonePolygonProps = {
	zone: PolyData;
	handleZoneClick: (
		lineVisibility: { [key: string]: boolean },
		polygonVisibility: { [key: string]: boolean }
	) => void;
	currentZone: ZoneData | undefined;
	zoneGameData: ZoneData;
	activeLine?: LineData;
	disabled?: boolean;
};

export default function ZonePolygon({
	zone,
	handleZoneClick,
	currentZone,
	zoneGameData,
	activeLine,
	disabled
}: ZonePolygonProps) {
	const amCurrentZone = zone.featureName === currentZone?.name;
	const amHighlighted = activeLine?.matchedPolygons.includes(zone.featureName)
	const coordsAsArray = zone.coords.map((coord) => [coord.lat, coord.lng]);
	const polygonCenter = polylabel([coordsAsArray], 0.0000001);
	const zoomThreshold = 15;
	const lineVisibilityTemp = Object.fromEntries(
		zone.matchedLines.map((line) => [line.featureName, true])
	);

	//const [zoom, setZoom] = useState(0);
	const map = useMap();
	// useEffect(() => {
	// 	if (map) {
	// 		map.addListener("zoom_changed", () => {
	// 			setZoom((map.getZoom() ?? 0));
	// 		});
	// 	}
	// }, [map]);

	const highlightedZonesTemp = Object.fromEntries(
		zone.matchedLines
			.map((line) =>
				line.matchedPolygons.map((poly) => {
					return [poly, true];
				})
			)
			.flat()
	);
	//console.log("i am ", zone.featureName, "and my highlight is", amHighlighted)
	return (
		<>
			<Polygon
				paths={zone.coords}
				key={zone.featureName}
				strokeColor={
					amCurrentZone ? theme.colors.green[4] : 
					amHighlighted ? theme.colors.orange[7] :
					zoneGameData.controlTeam || "black"
				}
				strokeOpacity={amCurrentZone || amHighlighted ? 1 : 0.8}
				strokeWeight={amCurrentZone ? 8 : zoneGameData.locked ? 6: 5}
				fillColor={
					zoneGameData.controlTeam ||
					(amCurrentZone ? theme.colors.green[6] : 
					amHighlighted ? theme.colors.green[6] :
					disabled ? theme.colors.gray[6] :
						"#FFFFFF00") 
				}
				fillOpacity={
					zoneGameData.locked ? 0.3 :
					disabled? 0.5 :
					0.15}
				onClick={() =>
				{
					if((map?.getZoom() ?? 30) > zoomThreshold){return};
					handleZoneClick(lineVisibilityTemp, highlightedZonesTemp);

				}
				}
				zIndex={amCurrentZone ? 25 :
				amHighlighted ? 24 : 
				zoneGameData.controlTeam ? 1 : 0}
			/>
			{/* {showLabels && (
				<PolygonLabel
					label={`${zone.featureName}`}
					position={{ lat: polygonCenter[0], lng: polygonCenter[1] }}
				/>
			)} */}
			{zoneGameData.locked ? <AdvancedMarker
				position={{ lat: polygonCenter[0] - 0.004, lng: polygonCenter[1] }}
			>
				<FaLock size="1rem" color={theme.colors[zoneGameData.controlTeam || "yellow"][8] || undefined} />
			</AdvancedMarker> : null}
		</>
	);
}
