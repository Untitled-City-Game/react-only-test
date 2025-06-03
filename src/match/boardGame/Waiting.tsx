import { games } from "@/scripts/consts";
import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import Header from "@/src/userInterface/Header/Header";
import { Button, Center, Container, Stack } from "@mantine/core";
import { useContext } from "react";

export default function Waiting() {
	console.log("rendering waiting page")
	const props: MetroGameBoardProps = useContext(GameContext);
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData
	return (
		<Center>
			<Stack>
				<Header color={game?.color || "white"}>Connect 4</Header>
				<h2>Your game is waiting to start</h2>
				<p>Players can still join.</p>
				{Object.values(playerData).map((player, index) => {
					return <Container key={index}>{player.name}, {player.teamColor} team</Container>
				})}
				<Button onClick={() => {
					props.moves.startGame()
				}
				}>Start the Game</Button>
			</Stack>
		</Center>
	)
}
