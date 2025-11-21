import { MatchTeamColor } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext, useEffect } from "react";
import { ImCool2 } from "react-icons/im";
import { IoLocationSharp } from "react-icons/io5";
import useTeamLocations from "@/src/match/interfaces/useTeamLocations";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { theme } from "@/src/styles/theme";
export default function LocationMarker({ position, accuracy, color }: { position: google.maps.LatLngLiteral, accuracy?: number, color: MatchTeamColor }) {
	const { G: gameData } = useContext(GameContext)
	const iconSize = 30
	//update my location with location server
	const teamImgStyle : React.CSSProperties = { 
		height: `${iconSize}px`, 
		width: `${iconSize}px`, 
		objectFit: "cover", 
		borderRadius: "50%", 
		position: "absolute", 
		bottom: `${iconSize * 0.75}px`, 
		left: `${-iconSize / 2}px` }
	return (
		<AdvancedMarker position={position}>
			<IoLocationSharp
				fill={color}
				stroke="white"
				strokeWidth={10}
				strokeOpacity={1}
				size={`${iconSize * 2}px`}
				style={{
					position: "absolute",
					bottom: "0px",
					left: `${-iconSize}px`
				}}
			/>
			
			<img style={teamImgStyle} src={gameData.teamPhotoURLs[color] ?? "/snakemarker.png"} />
			{/* : <ImCool2 style={teamImgStyle} color={theme.colors[color][1]} /> */}
			<Circle center={position} radius={accuracy} strokeColor={color} fillColor={color} strokeOpacity={0.3} fillOpacity={0.1} clickable={false} />
		</AdvancedMarker>
	)
}
