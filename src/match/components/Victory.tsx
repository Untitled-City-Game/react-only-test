import { GameContext } from "@/src/match/Board";
import Span from "@/src/userInterface/Span";
import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";

export default function Victory(){
	const gameState = useContext(GameContext);
	const [opened, { open, close }] = useDisclosure(true);
	
	if(!gameState.G.victory){
		return null
	}
	
	return (
		<Modal centered opened={opened} onClose={close} title="Victory">
			<Stack>
        		<Span fz="h3" ta="center">🎆 <Span fz="h3" tt="capitalize">{gameState.G.victory}</Span> team has won the game! 🎆</Span>
        		<Span fz="h4" ta="center">Thanks for playing!</Span>
			</Stack>
      	</Modal>
	)
}