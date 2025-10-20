import { MatchTeamColor } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";
export default function LocationMarker({position, color} : {position: google.maps.LatLngLiteral, color: MatchTeamColor}) {
	const {G: gameData, playerData} = useContext(GameContext)
	const iconSize = 30
	//update my location with location server
	const [teamLocations] = useTeamLocations();
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

		{/* <FaCircle color={color} size="1rem" style={{filter: `drop-shadow(0 0 3px ${color})`, marginBottom: "-0.75rem"}} /> */}
	</AdvancedMarker>
	)
}
