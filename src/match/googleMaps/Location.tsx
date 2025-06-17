import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useGeolocated } from "react-geolocated";
import { FaCircle } from "react-icons/fa";
export default function LocationMarker({initialPosition, color} : {initialPosition: google.maps.LatLngLiteral, color: string}) {
	const [position, setPosition] = useState(initialPosition);
	//Location marker
	const {coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
		watchPosition: true,
		userDecisionTimeout: 5000,
	});

	if(!coords){
		console.warn("no coords for location hook");
		return null;
	}
	const latlongcoords : google.maps.LatLngLiteral = {lat: coords.latitude, lng: coords.longitude}
	return coords ? (<AdvancedMarker position={latlongcoords}><FaCircle color={color} size="1rem" style={{filter: `drop-shadow(0 0 3px ${color})`}} /> </AdvancedMarker>) : null
}
