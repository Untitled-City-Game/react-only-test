import { gameLocationCenters } from "@/scripts/consts";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import React, { useContext, useEffect } from "react";
import { City, CoordSet } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";

interface MapElementProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
	center: google.maps.LatLngLiteral
};

export default function VisGlMapElement(props: MapElementProps) {
	//update my location with location server
	// useEffect(()=> {
	// 	console.log("emitting position change event")
	// 	updateMyLocation(myLocation, gameData.playerData.data.teamColor)
	// }, [myLocation])
	// const [teamLocations] = useTeamLocations()
	
	// console.log("team locations", teamLocations)
	return (
		<APIProvider 
		apiKey="AIzaSyCG6Ouy-lsuiGpNCcibChoSxW6f0zupHNc"
		libraries={["geometry"]}
		onError={(e) => console.error(e)}
		>
			<Map 
				mapId = "5eaa0d345956e4f1"
				streetViewControl={false}
				fullscreenControl={false}
				mapTypeControl={false}
				defaultCenter={props.center}
				defaultZoom={12}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				
			>
			{/* {
				teamLocations.map(teamLocation => {
					// console.log("rendering team location marker", teamLocation)
					return (
						<LocationMarker key={teamLocation.teamName} position={teamLocation.location} color={teamLocation.teamName} />
					)
				})
			} */}
			{props.children}
			{/* <>{props.zoneElements}</>
			<>{props.lineElements}</> */}
			</Map>
		</APIProvider>
	);
}

// function updateMyLocation(location: google.maps.LatLngLiteral, teamColor: string) {
// 	socket.emit('locationUpdate', {
// 		teamName: teamColor,
// 		location
// 	});
// }
