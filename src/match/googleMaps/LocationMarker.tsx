import { MatchTeamColor } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
export default function LocationMarker({position, accuracy, color} : {position: google.maps.LatLngLiteral, accuracy?: number, color: MatchTeamColor}) {
	const {G: gameData} = useContext(GameContext)
	const iconSize = 30
	//update my location with location server
	return (
	<AdvancedMarker position={position}>
		<IoLocationSharp 
		fill={color}
		size={`${iconSize*2}px`}
		style={{
			position: "absolute",
			bottom: "0px",
			left: `${-iconSize}px`
		}} />
		<img style={{height: `${iconSize}px`, width: `${iconSize}px`, objectFit: "cover", borderRadius : "50%", position: "absolute", bottom: `${iconSize*0.75}px`, left: `${-iconSize/2}px`}} src={gameData.teamPhotoURLs[color]}  />
		<Circle center={position} radius={accuracy} strokeColor={color} fillColor={color} strokeOpacity={0.3} fillOpacity={0.1} clickable={false} />
	</AdvancedMarker>
	)
}
