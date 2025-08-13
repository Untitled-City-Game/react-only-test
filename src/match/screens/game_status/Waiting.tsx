import { games } from "@/scripts/consts";
import { GameBoardContext, GameStateGeneric, PlayerData } from "@/scripts/types/types";
import Loading from "@/src/match/screens/game_status/Loading";
import DashedCard from "@/src/userInterface/DashedCard";
import Header from "@/src/userInterface/Header/Header";
import { HelpButton } from "@/src/match/components/help/HelpButton";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import P from "@/src/userInterface/P";
import { Box, Button, Center, Container, LoadingOverlay, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "@/src/match/Board";
import { ConnectFourGameState } from "@/scripts/games/connect_four/types";

export default function Waiting() {
	console.log("rendering waiting page");
	const props: GameBoardContext = useContext(GameContext);
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData;
	if (!game) {
		return <h1>Game not found</h1>
	}
	const [loading, setLoading] = useState(false);
	// useEffect(() => {
	// 	Notification.requestPermission();
	// });
	return (
		<Center>
			<FullHeightLayout>
				<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Building trains..." /> }} />
				<Header color={props.playerData.data.teamColor || "white"}>{game.name}</Header>
				<VerticalSpread>
					<div></div>
					<div>
						<Stack gap="xs" align="stretch">
							<Box>
														<h2 style={{ fontWeight: "light" }}><span style={{ fontWeight: "bold" }}>{props.G.gameName}</span> <br />is waiting to start.</h2>

						<P><strong>Host: </strong> {playerData[0]?.name}</P>
						<P><strong>Invite code: </strong>{props.matchID}</P>
						</Box>
						<GameInviteButton gameCode={props.gameCode} matchID={props.matchID} />
						<HelpButton />

						<TeamSummary gameData={props.G} />
						</Stack>
					</div>
					{props.playerData.data.admin ? <Button
						onClick={() => {
							setLoading(true);
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

function TeamSummary({ gameData }: { gameData: GameStateGeneric }) {
	const teams = Object.keys(gameData.allTeamsData).map((team) => {
		return Object.values(gameData.allPlayersData).filter((player: PlayerData) => player.teamColor === team);
	})

	return (
			<Stack>
				{teams.map((team, index) => (
					<DashedCard key={index} color={team[0].teamColor}>
						<Container ta="left" w="100%">
							<h3 style={{ textTransform: "capitalize" }}>{team[0].teamColor} team</h3>
							<P>{team.map((player) => player.name).join(", ")}</P>
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