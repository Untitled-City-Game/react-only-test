import { GameMeta } from "@/scripts/types/types";
import Span from "@/src/userInterface/Span";
import { Box } from "@mantine/core";

export default function GameIntro({game} : {game?: GameMeta}){
	if(!game){
		return null
	}
	return(
		<Box>
			<h2>Play a game of {game.name} where the city is your board!</h2>
			<p>{game.description}</p>
			<p>You'll need <Span fw="bold">{game.playerMin} to {game.playerMax} players</Span>, and around <Span fw="bold">3 hours</Span>. Check out the prep guide before your game day.</p>
		</Box>
	)
}