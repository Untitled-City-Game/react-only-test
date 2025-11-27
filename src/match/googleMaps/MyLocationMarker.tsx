import { gameLocationCenters } from "@/scripts/consts";
import { CoordSet, MatchTeamColor } from "@/scripts/types/types";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import useMyLocation, { useAndBroadcastMyLocation } from "@/src/match/interfaces/useMyLocation";

export default function MyLocationMarker(
	{color, defaultLocation, playerID="", broadcast=false} : {color: MatchTeamColor, defaultLocation: google.maps.LatLngLiteral, playerID?:string, broadcast?: boolean}
){
	const {position, accuracy} = broadcast ? 
		useAndBroadcastMyLocation(color, playerID, defaultLocation || { lat: 0, lng: 0 })
		: useMyLocation(defaultLocation);

	return (
		<LocationMarker position={position || defaultLocation} color={color} accuracy={accuracy} />
	)
}