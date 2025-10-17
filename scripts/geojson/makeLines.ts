import { LineData, LineFeature, PolyData, PolygonFeature } from "@/scripts/types/googleMaps";
import { Position } from "geojson";
import PointInPolygon from "point-in-polygon";

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
		const lineCoords = line.geometry.coordinates.map((coord: Position) => {
			const latlong = coord as number[];
			return {lat: latlong[1], lng: latlong[0]}
		})
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
	line.matchedPolygons = polygonSet.filter(onlyUnique) as string[]
	return line;
}

function onlyUnique(value: unknown, index: number, array : unknown[]) {
  return value && array.indexOf(value) === index;
}