import { games } from "@/scripts/consts";
import { GameBoardContext, GameStateGeneric, PlayerData } from "@/scripts/types/types";
import Loading from "@/src/match/screens/game_status/Loading";
import DashedCard, { SolidCard } from "@/src/userInterface/DashedCard";
import Header from "@/src/userInterface/Header/Header";
import { HelpButton } from "@/src/match/components/help/HelpButton";
import FullHeightLayout, { VerticalSpread } from "@/src/userInterface/Layout";
import P from "@/src/userInterface/P";
import { Box, Button, ButtonProps, Card, Center, Container, FileInput, LoadingOverlay, Stack, Title, useMantineTheme } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "@/src/match/Board";
import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { storage } from "@/scripts/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { SharedMoves } from "@/scripts/games/shared_moves/sharedMoves";
import { StartingZoneButton } from "@/src/match/screens/game_status/StartingZoneModal";
import Segment from "@/src/userInterface/Segment";
import { defaultColor } from "@/src/styles/theme";
export default function Waiting() {
	console.log("rendering waiting page");
	const props: GameBoardContext = useContext(GameContext);
	console.log("waiting props", props.G)
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData;
	if (!game) {
		return <h1>Game not found</h1>
	}
	if (!playerData) {
		return <h1>allPlayersData data not found in Waiting!</h1>
	}
	const [loading, setLoading] = useState(false);
	const [startDisabled, setStartDisabled] = useState(props.gameCode === "connect_four" ? true : false);
	const teamColor = props.playerData.data.teamColor
	return (
		<Center>
			<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Building trains..." /> }} />
			<FullHeightLayout>
				<Header color={teamColor || "white"}>{game.name}</Header>
				<VerticalSpread>
					<div></div>
					<div>
						<Stack gap="lg" align="stretch">
							<h2 style={{ fontWeight: "light" }}>Your Connect Four game is waiting to start.</h2>
							<Segment color={teamColor}>
								<Stack>
									<Title order={3} size="h4">Teams and Players</Title>
									<TeamSummary gameData={props.G} playerTeam={teamColor} />
									<GameInviteButton color={defaultColor({color: teamColor, shade: 7})} gameCode={props.gameCode} matchID={props.matchID} />
								</Stack>
							</Segment>
							<Segment>
								<Stack align="stretch">
									<Title order={3} size="h4">Before you Start</Title>
									<HelpButton />
									{(props.playerData.data.admin && props.gameCode === "connect_four") ? <StartingZoneButton setStartDisabled={setStartDisabled} /> : null}
								</Stack>
							</Segment>
						</Stack>
					</div>
					{props.playerData.data.admin ? <Stack>
						<Button
							disabled={startDisabled}
							onClick={() => {
								setLoading(true);
								props.moves.startGame();
							}}>
							Start the Game
						</Button></Stack>
						: <div />}
				</VerticalSpread>
			</FullHeightLayout>
		</Center>
	);
}

function TeamSummary({ gameData, playerTeam }: { gameData: GameStateGeneric, playerTeam: string }) {
	const teams = Object.keys(gameData.allTeamsData).map((team) => {
		return Object.values(gameData.allPlayersData).filter((player: PlayerData) => player.teamColor === team);
	})

	return (
		<Stack>
			{teams.map((team, index) => (
				<SolidCard key={index} color={team[0].teamColor}>
					<Container ta="left" w="100%">
						<h3 style={{ textTransform: "capitalize" }}>{team[0].teamColor} team</h3>
						<P>{team.map((player) => player.name).join(", ")}</P>
					</Container>
					{gameData.teamPhotoURLs[team[0].teamColor] ? <img style={{ height: "80px", width: "80px", objectFit: "cover", borderRadius: "10px" }} src={gameData.teamPhotoURLs[team[0].teamColor]} /> :
						team[0].teamColor === playerTeam ? <TeamFileUpload team={team} /> : null}
				</SolidCard>
			))}
		</Stack>
	)
}

export function GameInviteButton({ gameCode, matchID, ...rest }: { gameCode: string, matchID: string } & ButtonProps) {
	return (
		<Button {...rest} onClick={() => navigator.clipboard.writeText(`${process.env.GAME_ADDRESS}/lobby/${gameCode}/join-match/${matchID}`)}>
			Copy invite link
		</Button>
	)
}

function TeamFileUpload({ team }: { team: PlayerData[] }) {
	const props = useContext(GameContext);
	const moves = props.moves as SharedMoves
	const gameData = props.G
	async function addTeamPhoto(payload: File | null) {
		if (!payload) { return }
		const imageRef = ref(
			storage,
			`images/${gameData.gameName}/teampic${team[0].teamColor}${Date.now()}`
		);
		try {
			const uploadTask = await uploadBytes(imageRef, payload);
			console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
		} catch (e) {
			console.error("Error adding document: ", e);
		}

		let evidenceURL = "";

		try {
			evidenceURL = await getDownloadURL(imageRef);
		} catch {
			console.error("couldn't get download url");
			return;
		}
		moves.addTeamPhoto(evidenceURL, team[0].teamColor)
	}
	return (
		<FileInput label="Team photo" placeholder="Upload" miw="50%" onChange={addTeamPhoto} />
	)
}