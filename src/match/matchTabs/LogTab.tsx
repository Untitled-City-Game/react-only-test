import { ClaimStateMoves } from "@/scripts/games/connect_four";
import {
	GameState,
	LogMetadata,
	MetroGameBoardProps,
	PlayerData,
} from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import ImageMantine from "@/src/userInterface/ImageMantine";
import Span from "@/src/userInterface/Span";
import StatusBar from "@/src/userInterface/StatusBar";
import { Alert, Box, Button, Container, Group, Stack } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function LogTab() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const playerData = props.playerData.data;
	async function handleEndGame() {
		console.log("ending game");
		// await lobbyClient.updatePlayer("connect-four", props.matchID, { playerID: playerData.playerID, credentials: props.credentials || 'undefined', data: { 'teamColor': props.playerData.data.teamColor, 'gameover': true } });
		moves.endGame();
		//props.playerData.setter(undefined);
	}
	return (
		<>
			<Box pos="sticky" top={0} style={{ zIndex: 10000 }}>
				<StatusBar />
				<ComplexHeader color={props.playerData.data.teamColor}>
					<Stack gap="0" ta="center">
						<h1>Log</h1>
						<p style={{ margin: 0 }}>
							Game will end at{" "}
							{props.G.endTime &&
								new Date(props.G.endTime).toLocaleTimeString(
									"en-US",
									{ timeStyle: "short" }
								)}
						</p>
						<Group mb="sm">
							<Button variant="outline" bg="white">
								Pause Game
							</Button>
							<Button onClick={handleEndGame}>End Game</Button>
						</Group>
					</Stack>
				</ComplexHeader>
			</Box>
			<Container mih="0" w="100%" mt="md">
				<Stack align="flex-start" mb="md">
					{props.log.map((entry, index) => (
						<ErrorBoundary
							key={index}
							fallback={<span>Message failed to load.</span>}>
							<MessageBox
								key={index}
								entry={entry}
								gameData={props.G}
								playerData={playerData}
							/>
						</ErrorBoundary>
					))}
				</Stack>
			</Container>
		</>
	);
}

function MessageBox({
	entry,
	gameData,
	playerData,
}: {
	entry: LogEntry;
	gameData: GameState;
	playerData: PlayerData;
}) {
	const [timestamp, setTimestamp] = useState("placeholder timestamp");
	const metadata = entry.metadata
		? (entry.metadata as LogMetadata)
		: undefined;
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	useEffect(() => {
		if (metadata && metadata.date) {
			console.log("metadata date", metadata.date);
			const dateObj = new Date(metadata.date);
			console.log("dateobj", dateObj);
			const time = dateObj.toLocaleTimeString();
			console.log("time", time);
			setTimestamp(time);
			return;
		} else {
			setTimestamp("no timestamp");
			return;
		}
	}, [metadata]);
	const Message = () => {
		switch (entry.action.payload.type) {
			case "completeChallengeAndClaim":
				return (
					<ChallengeCompleted
						metadata={entry.metadata as LogMetadata}
					/>
				);

			case "playerSetup":
				return <JoinedMatch senderData={senderData} />;

			case "startGame":
				return <GameStarted senderData={senderData} />;

			default:
				return <span>{entry.action.payload.type}</span>;
		}
	};

	return (
		<Alert
			maw="max-content"
			miw="40%"
			title={senderData.name}
			color={senderData.teamColor}
			bd="1px solid"
			ml={senderData.playerID === playerData.playerID ? "auto" : "0"}>
			<Span fs="italic" mt="0" size="xs">
				<span className="capitalize">{senderData.teamColor}</span> team
			</Span>
			{Message()}
			<Span>{timestamp}</Span>
		</Alert>
	);
}

function ChallengeCompleted({ metadata }: { metadata: LogMetadata }) {
	return (
		<>
			<Span>
				<span className="capitalize">{metadata.team}</span> team
				completed challenge {'"'}
				{metadata.challenge}
				{'"'} to claim {metadata.zoneName || metadata.zone}
			</Span>
			{metadata.evidence && (
				<ImageMantine
					src={metadata.evidence}
					alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
					w={300}
					h={300}
				/>
			)}
		</>
	);
}

function JoinedMatch({ senderData }: { senderData: PlayerData }) {
	return (
		<>
			<Span>
				<span className="capitalize">{senderData.name}</span> joined the
				match on{" "}
				<span className="capitalize">{senderData.teamColor}</span> team.
			</Span>
		</>
	);
}

function GameStarted({ senderData }: { senderData: PlayerData }) {
	return (
		<>
			<Span>
				<span className="capitalize">{senderData.name}</span> started
				the game.
			</Span>
		</>
	);
}
