import { PlayStateMoves_Snake } from "@/scripts/games/snake/snake";
import { Fruit } from "@/scripts/games/snake/types";
import { GameContext, SnakeContext } from "@/src/match/Board";
import P from "@/src/userInterface/P";
import { Button, Modal, Stack } from "@mantine/core";
import { useContext } from "react";
import { FaAppleAlt } from "react-icons/fa";

export default function FruitModal({opened, close, fruit} : {opened: boolean, close: () => void, fruit: Fruit }){
	const moves = useContext(GameContext).moves as PlayStateMoves_Snake
	return( 
	<Modal opened={opened} centered onClose={close} title={fruit.challenge.title}>
		<Stack align="center">
		<FaAppleAlt color="red" size="5rem" />
        <P>{fruit.challenge.title}</P>
		<P>{fruit.challenge.description}</P>
		<Button onClick={() => {
			close()
			moves.eatFruit(fruit)
		}}>Complete and eat!</Button>
		</Stack>
     </Modal>)
	   
}