import { games } from "@/scripts/consts";
import { GameState, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import DashedCard from "@/src/userInterface/DashedCard";
import Header from "@/src/userInterface/Header/Header";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import { Button, Center, Container, Stack } from "@mantine/core";
import { useContext } from "react";

export default function Waiting() {
	console.log("rendering waiting page");
	const props: MetroGameBoardProps = useContext(GameContext);
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData;
	if(!game){
		return <h1>Game not found</h1>
	}
	return (
		<Center>
			<FullHeightLayout>
				<Header color={props.playerData.data.teamColor || "white"}>Connect 4</Header>
				<VerticalSpread>
					<div></div>
					<div>
					<h2 style={{fontWeight: "light"}}>Your game <br/><span style={{fontWeight: "bold"}}>{props.G.gameName}</span> <br/>is waiting to start.</h2>
					<p>Players can still join.</p>
					<TeamSummary gameData={props.G}/>
					</div>
					<Button
						onClick={() => {
							props.moves.startGame();
						}}>
						Start the Game
					</Button>
				</VerticalSpread>
			</FullHeightLayout>
		</Center>
	);
}

function TeamSummary({gameData} : {gameData: GameState}){ 
	const teams = Object.keys(gameData.allTeamsData).map((team) => {
		return Object.values(gameData.allPlayersData).filter((player : PlayerData) => player.teamColor === team);
	})

	return (
		<Container>
			<Stack>
			{teams.map((team, index) => (
				<DashedCard key={index} color={team[0].teamColor}>
					<Container ta="left" w="100%">
					<h3 style={{textTransform: "capitalize"}}>{team[0].teamColor} team</h3>
					<p>{team.map((player) => player.name).join(", ")}</p>
					</Container>
				</DashedCard>
			))}
			</Stack>
		</Container>
	)
}