import { socket } from "@/scripts/socket";
import { LocationData, MatchTeamColor } from "@/scripts/types/types";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { FaCircle } from "react-icons/fa";

const ACCURACY_MAX = 100;
const UPDATE_TIMEOUT = 5;

export default function useMyLocation(initialPosition?: google.maps.LatLngLiteral){
	const [position, setPosition] = useState(initialPosition || {lat: 0, lng: 0});
	const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
	const geoLocation = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
		watchPosition: true,
		userDecisionTimeout: 100000,
	});
	const coords = geoLocation.coords;

	useEffect(() => {
		if(!coords){
			console.warn("no coords for location hook");
			console.log(geoLocation)
			return;
		}

		const latlongcoords : google.maps.LatLngLiteral = {lat: coords.latitude, lng: coords.longitude}
		setPosition(latlongcoords);
		setAccuracy(coords.accuracy);
	}
	, [coords,geoLocation.timestamp]);

	const time = geoLocation.timestamp
	console.log("updated geolocation", position, accuracy, time)
	return {position, accuracy, time}
}

export function useAndBroadcastMyLocation(teamName: MatchTeamColor, playerID: string, initialPosition?: google.maps.LatLngLiteral) {
	const [position, setPosition] = useState(initialPosition || {lat: 0, lng: 0});
	const [accuracy, setAccuracy] = useState<number | undefined>(undefined)
	const teamLocations = useTeamLocations()
	const geoLocation = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
		watchPosition: true,
		userDecisionTimeout: 100000,
	});
	const coords = geoLocation.coords;
	const time = geoLocation.timestamp
	useEffect(() => {

		if(!coords){
			console.warn("no coords for location hook");
			return;
		}

		const latlongcoords : google.maps.LatLngLiteral = {lat: coords.latitude, lng: coords.longitude}
		setPosition(latlongcoords);
		setAccuracy(coords.accuracy);
		
		//Check for bad accuracy
		if(coords.accuracy > ACCURACY_MAX){
			console.log("Not accurate enough to emit", coords.accuracy);
			return;
		}

		const myTeamLastLocation = teamLocations.find(team => team.teamName === teamName)
		
		//Check if my position is not useful for update
		
		if(myTeamLastLocation){
			console.log("now")
			const expired = (Date.now() - myTeamLastLocation.timestamp) < UPDATE_TIMEOUT*5000;
			const betterAccuracy = coords.accuracy < myTeamLastLocation.accuracy;
			const isMe = myTeamLastLocation.playerID === playerID;
			if(!isMe && !expired && !betterAccuracy){
				console.log("another teammate's recent location update is better, not emitting");
				return;
			}
		}

		//broadcast to other players
		const broadcastData : LocationData = {
			teamName,
			location: { lat: coords.latitude, lng: coords.longitude },
			accuracy: coords.accuracy,
			playerID,
			timestamp: time??Date.now()
		}
		socket.emit("locationUpdate", broadcastData)
	}
	, [coords])

	
	return {position, accuracy, time}
}