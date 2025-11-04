import { socket } from "@/scripts/socket";
import { MatchTeamColor } from "@/scripts/types/types";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { FaCircle } from "react-icons/fa";

export default function useMyLocation(updateSocket : boolean, teamName: MatchTeamColor, initialPosition?: google.maps.LatLngLiteral) {
	const [position, setPosition] = useState(initialPosition || {lat: 0, lng: 0});
	const [accuracy, setAccuracy] = useState<number | undefined>(undefined)
	const {coords} = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
		watchPosition: true,
		userDecisionTimeout: 5000,
	});

	useEffect(() => {
		if(!coords){
			console.warn("no coords for location hook");
			return;
		}
		// if(coords.latitude === position.lat && coords.longitude === position.lng){
		// 	//console.log('no change in coords detected')
		// 	return;
		// }
		const latlongcoords : google.maps.LatLngLiteral = {lat: coords.latitude, lng: coords.longitude}
		setPosition(latlongcoords);
		setAccuracy(coords.accuracy)
		if(updateSocket){
			socket.emit("locationUpdate", {
				teamName,
				location: {lat: coords.latitude, lng: coords.longitude},
				accuracy: coords.accuracy
			})
		}
	}
	, [coords])

	
	return {position, accuracy}
}