import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { FaCircle } from "react-icons/fa";

export default function useMyLocation(initialPosition?: google.maps.LatLngLiteral) {
	const [position, setPosition] = useState(initialPosition || {lat: 0, lng: 0});
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
		if(coords.latitude === position.lat && coords.longitude === position.lng){
			//console.log('no change in coords detected')
			return;
		}
		const latlongcoords : google.maps.LatLngLiteral = {lat: coords.latitude, lng: coords.longitude}
		setPosition(latlongcoords);
	}
	, [coords])

	
	return position
}