import { Color, PolyData, ZoneData } from "@/scripts/types";
import PolygonLabel from "@/src/match/googleMaps/PolygonLabel";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";
import { useMap } from "@vis.gl/react-google-maps";
import polylabel from "polylabel";
import { useEffect, useState } from "react";

type ZonePolygonProps = {
	zone: PolyData;
	handleZoneClick: (
		lineVisibility: { [key: string]: boolean },
		polygonVisibility: { [key: string]: boolean }
	) => void;
	currentZone: ZoneData | undefined;
	highlightedZones: { [key: string]: boolean };
	highlightColor: Color;
	zoneGameData: ZoneData;
};

export default function ZonePolygon({
	zone,
	handleZoneClick,
	currentZone,
	highlightedZones,
	highlightColor,
	zoneGameData,
}: ZonePolygonProps) {
	const amCurrentZone = zone.featureName === currentZone?.name;
	const coordsAsArray = zone.coords.map((coord) => [coord.lat, coord.lng]);
	const polygonCenter = polylabel([coordsAsArray], 0.0000001);
	const [showLabels, setShowLabels] = useState(true);
	const zoomThreshold = 13;
	const lineVisibilityTemp = Object.fromEntries(
		zone.matchedLines.map((line) => [line.featureName, true])
	);
	const map = useMap();
	useEffect(() => {
		console.log("map", map);
		if (map) {
			map.addListener("zoom_changed", () => {
				setShowLabels((map.getZoom() ?? 0) < zoomThreshold);
			});
		}
	}, [map]);

	const highlightedZonesTemp = Object.fromEntries(
		zone.matchedLines
			.map((line) =>
				line.matchedPolygons.map((poly) => {
					return [poly, true];
				})
			)
			.flat()
	);
	console.log("rendering zone");
	return (
		<>
			<Polygon
				paths={zone.coords}
				key={zone.featureName}
				strokeColor={
					amCurrentZone ? "purple" : zoneGameData.color || "black"
				}
				strokeOpacity={0.8}
				strokeWeight={amCurrentZone ? 4 : 3}
				fillColor={
					zoneGameData.color ||
					(amCurrentZone ? "purple" : "#FFFFFF00")
				}
				fillOpacity={0.15}
				onClick={() =>
					handleZoneClick(lineVisibilityTemp, highlightedZonesTemp)
				}
				zIndex={amCurrentZone ? 10 : zoneGameData.color ? 1 : 0}
			/>
			{showLabels && (
			<PolygonLabel
				label={zone.featureName}
				position={{ lat: polygonCenter[0], lng: polygonCenter[1] }}
			/>
			)}
		</>
	);
}
