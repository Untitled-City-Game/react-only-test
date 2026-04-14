import { LineData, LineFeature, PolyData, PolygonFeature } from "@/scripts/types/googleMaps";
import PointInPolygon from "point-in-polygon";
import onlyUnique from "@/scripts/helpers/onlyUnique";
import { toLatLng } from "@/scripts/geojson/coords";

export default function makeLines(zoneDataObj: GeoJSON.FeatureCollection) {
	//filter to polylines
	const isPolyLine = (line: GeoJSON.Feature) => line.geometry.type === "LineString";
	const polyLines : GeoJSON.Feature[] = zoneDataObj.features.filter(isPolyLine);

	//filter to polylines with valid properties and coordinates
	const isValidPolyLine = (line: GeoJSON.Feature): line is LineFeature => {return 'properties' in line && 'geometry' in line && 'coordinates' in line.geometry && line.geometry.coordinates.length > 0;}
	const validPolyLines = polyLines.filter(isValidPolyLine);

	//Create the lines
	const regionLines : LineData[] = validPolyLines.map((line: LineFeature) => {
		const lineName: string = line.properties.Name || line.properties.name;
		//convert coords to latlong
		const lineCoords = line.geometry.coordinates.map(toLatLng)
		return {featureName: lineName, coords: lineCoords, matchedPolygons: []};
	})
	return regionLines;
}

export function assignPolygons(lines: LineData[], polygons: PolyData[]){
	return lines.map(line => findPolygons(line, polygons))
}

function findPolygons(line: LineData, polygons: PolyData[]){
	const polygonSet = line.coords.map(coord => {
		return polygons.find(poly => PointInPolygon([coord.lng, coord.lat], poly.coords.map(coord => [coord.lng, coord.lat])))?.featureName
	})
	line.matchedPolygons = onlyUnique(polygonSet.filter(Boolean) as string[])
	return line;
}