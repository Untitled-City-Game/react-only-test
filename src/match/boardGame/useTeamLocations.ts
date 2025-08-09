export type LocationData = {
	teamName: string;
	location: google.maps.LatLngLiteral
}
import { socket } from "@/scripts/socket"
import { useState, useEffect } from "react";

export default function useTeamLocations(){
	const [isConnected, setIsConnected] = useState(socket.connected);
  	const [teamLocations, setTeamLocations] = useState<LocationData[]>([]);
	
	useEffect(() => {
		function onConnect() {
			console.warn("socket.io location server is connected now")
			setIsConnected(true);
		}

		function onDisconnect() {
			console.warn("socket.io location server is disconnected now")
			setIsConnected(false);
		}

		function onLocationUpdate(value : LocationData) {
			// console.log("Received location update broadcast", value);
			setTeamLocations(previous => {
				const index = previous.findIndex(teamData => teamData.teamName === value.teamName);
				if (index == -1){
					return [...previous, value];
				};
				previous.splice(index, 1).push(value);
				return previous;
			});
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('locationUpdate', onLocationUpdate);
		
		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('locationUpdate', onLocationUpdate);
		};
	}, []);


	return [teamLocations]
}

