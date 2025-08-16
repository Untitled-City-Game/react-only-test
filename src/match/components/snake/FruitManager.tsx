import { SnakeContext } from "@/src/match/Board";
import FruitMarker from "@/src/match/components/snake/Fruit";
import FruitModal from "@/src/match/components/snake/FruitModal";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useState } from "react";

export default function FruitManager(){
	const snakeGameData = useContext(SnakeContext);
 	 const [opened, { open, close }] = useDisclosure(false);	
	 const [currentFruit, setCurrentFruit] = useState(snakeGameData.fruits[0])
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
			<FruitModal opened={opened} close={close} fruit={currentFruit} />
		</>
	)
}