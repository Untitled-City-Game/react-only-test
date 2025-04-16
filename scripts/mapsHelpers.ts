import { Feature, LineString, Polygon, Position } from "geojson";

export type ConfidentPosition = [number, number] | [number, number, number]
export function toLatLong(coord: ConfidentPosition) {
		return { lat: coord[1], lng: coord[0] };
	}
export function PolygonLatlongs(zone: Feature<Polygon>) {
	return zone.geometry.coordinates[0]?.map((coord: Position) => {
		return toLatLong(coord as ConfidentPosition);
	});
}

export function LineLatlongs(zone: Feature<LineString>) {
	return zone.geometry.coordinates.map((coord: Position) => {
		return toLatLong(coord as ConfidentPosition);
	});
}
 
export function getBoundingBoxLiteral(polygon: Feature<Polygon>) : google.maps.LatLngBoundsLiteral {
	const coords = PolygonLatlongs(polygon);
	if(!coords) throw new Error("Polygon has no coordinates");
	const minLat = Math.min(...coords.map(coord => coord.lat));
	const maxLat = Math.max(...coords.map(coord => coord.lat));
	const minLng = Math.min(...coords.map(coord => coord.lng));
	const maxLng = Math.max(...coords.map(coord => coord.lng));
	return {
		north: maxLat,
		south: minLat,
		east: maxLng,	
		west: minLng,
	}
}