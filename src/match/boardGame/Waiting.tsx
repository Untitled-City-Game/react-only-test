import { games } from "@/scripts/consts";
import { GameState, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import DashedCard from "@/src/userInterface/DashedCard";
import Header from "@/src/userInterface/Header/Header";
import { HelpButton } from "@/src/userInterface/help/HelpButton";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import P from "@/src/userInterface/P";
import { Box, Button, Center, Container, Stack } from "@mantine/core";
import { useContext, useEffect } from "react";

export default function Waiting() {
	console.log("rendering waiting page");
	const props: MetroGameBoardProps = useContext(GameContext);
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData;
	if (!game) {
		return <h1>Game not found</h1>
	}
	useEffect(() => {
		Notification.requestPermission();
	});
	return (
		<Center>
			<FullHeightLayout>
				<Header color={props.playerData.data.teamColor || "white"}>Connect 4</Header>
				<VerticalSpread>
					<div></div>
					<div>
						<Stack gap="s" align="stretch">
							<Box>
														<h2 style={{ fontWeight: "light" }}><span style={{ fontWeight: "bold" }}>{props.G.gameName}</span> <br />is waiting to start.</h2>

						<P><strong>Host: </strong> {playerData[0]?.name}</P>
						<p><strong>Invite code: </strong>{props.matchID}</p>
						</Box>
						<GameInviteButton gameCode={props.gameCode} matchID={props.matchID} />
						<HelpButton />

						<TeamSummary gameData={props.G} />
						</Stack>
					</div>
					{props.playerID === '0' ? <Button
						onClick={() => {
							props.moves.startGame();
						}}>
						Start the Game
					</Button>
						: <div />}
				</VerticalSpread>
			</FullHeightLayout>
		</Center>
	);
}

function TeamSummary({ gameData }: { gameData: GameState }) {
	const teams = Object.keys(gameData.allTeamsData).map((team) => {
		return Object.values(gameData.allPlayersData).filter((player: PlayerData) => player.teamColor === team);
	})

	return (
			<Stack>
				{teams.map((team, index) => (
					<DashedCard key={index} color={team[0].teamColor}>
						<Container ta="left" w="100%">
							<h3 style={{ textTransform: "capitalize" }}>{team[0].teamColor} team</h3>
							<p>{team.map((player) => player.name).join(", ")}</p>
						</Container>
					</DashedCard>
				))}
			</Stack>
	)
}

export function GameInviteButton({ gameCode, matchID }: { gameCode: string, matchID: string}){
	return(
		<Button onClick={() => navigator.clipboard.writeText(`${process.env.GAME_ADDRESS}lobby/${gameCode}/join-match/${matchID}`)}>
			Copy invite link
		</Button>
	)
}