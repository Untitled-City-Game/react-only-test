import { gameLocationCenters } from "@/scripts/consts";
import { CoordSet, MatchTeamColor } from "@/scripts/types/types";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import useMyLocation from "@/src/match/interfaces/useMyLocation";

export default function MyLocationMarker({color, defaultLocation} : {color: MatchTeamColor, defaultLocation: google.maps.LatLngLiteral}){
	const myLocation = useMyLocation(true, color, defaultLocation || { lat: 0, lng: 0 });
	return (
		<LocationMarker position={myLocation || defaultLocation} color={color} />
	)
}