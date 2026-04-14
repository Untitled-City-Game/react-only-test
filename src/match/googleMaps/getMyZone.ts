import { ConnectFourContext } from "@/src/match/Board";
import { useContext } from "react";
import PointInPolygon from "point-in-polygon";
import { PolyData } from "@/scripts/types/googleMaps";


export default function getMyZone(myLocation : google.maps.LatLngLiteral, zones : PolyData[]){
	// Find which zone I'm in
	const myZone = zones.find(zone =>
		PointInPolygon([myLocation.lng, myLocation.lat], zone.coords.map(coord => [coord.lng, coord.lat]))
	);

	if (!myZone) {
		return null; // Not in any zone
	}

	return myZone
}