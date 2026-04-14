import { Position } from "geojson";

export function toLatLng(coord: Position): { lat: number; lng: number } {
	const latlong = coord as number[];
	return { lat: latlong[1], lng: latlong[0] };
}
