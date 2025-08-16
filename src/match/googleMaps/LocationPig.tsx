import { PlayStateMoves_Snake } from "@/scripts/games/snake/snake";
import { CoordSet } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import { useContext, useEffect, useState } from "react";

export default function LocationPig({initialPosition} : {initialPosition : google.maps.LatLngLiteral}){
	const [position, setPosition] = useState<google.maps.LatLngLiteral>(initialPosition);
	const gameContext = useContext(GameContext)
	const moves = gameContext.moves as unknown as PlayStateMoves_Snake
	useEffect(()=> {
		gameContext.moves.addSegment(position)
	}, [position]);
	
	const offset = 0.0001
	//listen for arrow key input
	const handleKeyPress = (event : KeyboardEvent) => {
		switch(event.key){
			case 'w':
				setPosition((prevPosition) => {
					return {lat: prevPosition.lat + offset, lng: prevPosition.lng};
				});
				break;
			case 'a':
				setPosition((prevPosition) => {
					return {lat: prevPosition.lat, lng: prevPosition.lng - offset};
				});				
				break;
			case 's':
				setPosition((prevPosition) => {
					return {lat: prevPosition.lat - offset, lng: prevPosition.lng};
				});					
				break;
			case 'd':
				setPosition((prevPosition) => {
					return {lat: prevPosition.lat, lng: prevPosition.lng + offset};
				});	
				break;
		}
	}

	useEffect(() => {
		 document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener('keydown', handleKeyPress, false);
	})
	return (
		<LocationMarker position={position} color={"purple"} />
	)
}