import { GameContext } from "@/src/match/Board";
import Span from "@/src/userInterface/Span";
import TeamAvatar from "@/src/userInterface/TeamAvatar";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect } from "react";

export default function VictoryModal(){
	const GameState = useContext(GameContext);
	const [opened, { open, close }] = useDisclosure(GameState.G.victory !== undefined);
	useEffect(()=> {
		if(GameState.G.victory !== undefined){
			open()
		}
	}, [GameState.G.victory])
	return (
		<Modal opened={opened} onClose={close} title="Winner!">
			{GameState.G.victory ? <TeamAvatar color={GameState.G.victory} photoURL={GameState.G.teamPhotoURLs[GameState.G.victory]} style={teamImgStyle} /> : null}
			🎆 <Span tt="capitalize">{GameState.G.victory}</Span> team completed a line of 4 to win the game! 🎆
		</Modal>
	)
}

const teamImgStyle : React.CSSProperties = { 
		display: 'block',
		margin: 'auto',
		width: `60%`, 
		objectFit: "cover", 
		borderRadius: "8px", 
		}