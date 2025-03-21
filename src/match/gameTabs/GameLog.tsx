import { ClaimStateMoves } from "@/scripts/connect_four";
import { GameState, LogMetadata, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import { GameContext } from "@/src/match/Board";
import Header from "@/src/userInterface/Header";
import ImageMantine from "@/src/userInterface/ImageMantine";
import Span from "@/src/userInterface/Span";
import { Alert, Box, Button, Group, Stack } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext, useEffect, useState } from "react";

export default function GameLog() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const playerData = props.playerData.data;
	function handleEndGame(){
		console.log("ending game");
		moves.endGame();
		props.playerData.setter(undefined);
	}
	return (
		<>
			<Header>
				<h1>Game Log</h1>
				<p>Game will end at GAME END TIME</p>
				<Group>
					<Button variant="outline">Pause Game</Button>
					<Button onClick={handleEndGame}>End Game</Button>
				</Group>
			</Header>
			<Box m="md">
				<Stack align="flex-start">
					{props.log
						.map((entry, index) => (
							<MessageBox key={index} entry={entry} gameData={props.G} playerData={playerData}>
								{entry.action.payload.type === "completeChallengeAndClaim" ? <ChallengeCompleted metadata={entry.metadata as LogMetadata} /> : entry.action.type}
							</MessageBox>
						))
						.reverse()}
				</Stack>
			</Box>
		</>
	);
}

function MessageBox({ children, entry, gameData, playerData }: { children: React.ReactNode, entry: LogEntry, gameData: GameState, playerData: PlayerData }) {
	const [timestamp, setTimestamp] = useState("");
	const metadata = entry.metadata ? entry.metadata as LogMetadata : undefined;
	useEffect(() => {
		if(metadata && metadata.date){
			const date = new Date(metadata.date);
			setTimestamp(date.toLocaleTimeString());
			return;
		}
	}, [metadata]);
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	return (
		<Alert maw="max-content" miw="40%" title={senderData.name} color={senderData.teamColor} ml={senderData.playerID === playerData.playerID ? "auto" : "0"}>
			<Span fs="italic" mt="0" size="xs"><span className="capitalize">{senderData.teamColor}</span> team</Span>
			{children}
			<Span>{timestamp}</Span>
		</Alert>
	);
}

function ChallengeCompleted({ metadata }: { metadata: LogMetadata }) {
	return (
		<>
			<Span>
				<span className="capitalize">{metadata.team}</span> team completed challenge {'"'}{metadata.challenge}{'"'} to claim {metadata.zoneName || metadata.zone}
			</Span>
			{metadata.evidence && (
				<ImageMantine src={metadata.evidence} alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`} w={300} h={300} />
			)}
		</>
	)

}
// function MetadataRenderer({ metadata }: { metadata: LogMetadata}) {
// 	if (!metadata){
// 		return <Span>No metadata</Span>
// 		}
// 		return (
// 			<Stack>
// 				<Span>Date: {metadata.date.toLocaleString()}</Span>
// 				<Span>Team: {metadata.team}</Span>
// 				{metadata.challenge && <Span>Challenge: {metadata.challenge}</Span>}
// 				{metadata.zone && <Span>Zone: {metadata.zone}</Span>}
// 				{metadata.evidence && <Image src={metadata.evidence} alt="evidence" w={300} h={300} />}
// 				</Stack>
// 			)
// }