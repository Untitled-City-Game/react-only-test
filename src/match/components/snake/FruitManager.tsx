import { SnakeContext } from "@/src/match/Board";
import FruitMarker from "@/src/match/components/snake/Fruit";
import FruitModal from "@/src/match/components/snake/FruitModal";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import { useDisclosure } from "@mantine/hooks";
import { distance } from "@turf/turf";
import { useContext, useEffect, useState } from "react";

export default function FruitManager({playerLocation} : {playerLocation : google.maps.LatLngLiteral}){
	const snakeGameData = useContext(SnakeContext);
 	 const [opened, { open, close }] = useDisclosure(false);	
	 const [currentFruit, setCurrentFruit] = useState(snakeGameData.fruits[0])
	const [playerDistance, setPlayerDistance] = useState(99999)
	useEffect(() => {
		const playerDistanceCalc = distance([playerLocation.lng, playerLocation.lat], [currentFruit.coords.lng, currentFruit.coords.lat], {units: "meters"});
		console.warn("player distance", playerDistanceCalc, playerLocation, currentFruit.coords)
		setPlayerDistance(playerDistanceCalc)
	}, [currentFruit, playerLocation])

	const fruitElements = snakeGameData.fruits.map((fruit, index) => {
		return (
			<FruitMarker fruitData={fruit} key={index} onClick={()=>{
				open()
				setCurrentFruit(fruit)
			}} />
		)
	})
	
	return(
		<>
			{fruitElements}
			<FruitModal opened={opened} close={close} fruit={currentFruit} distance={playerDistance} />
		</>
	)
}