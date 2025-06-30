import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import {
	GameState,
	LogMetadata,
	MetroGameBoardProps,
	PlayerData,
} from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { useAutoScrollToBottom } from "@/src/userInterface/chatScroll";
import ConfirmButton from "@/src/userInterface/ConfirmModal";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import ImageMantine from "@/src/userInterface/ImageMantine";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import StatusBar from "@/src/userInterface/StatusBar";
import { Alert, Box, Button, Group, ScrollAreaAutosize, Stack } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ReactPlayer from 'react-player';
export default function LogTab({active}: {active: string | null}) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const playerData = props.playerData.data;
	async function handleEndGame() {
		console.log("ending game");
		// await lobbyClient.updatePlayer("connect-four", props.matchID, { playerID: playerData.playerID, credentials: props.credentials || 'undefined', data: { 'teamColor': props.playerData.data.teamColor, 'gameover': true } });
		moves.endGame();
		//props.playerData.setter(undefined);
	}

	useEffect(()=> {
		console.log("active tab changed");
		scrollToBottom();
	}, [active, props.deltalog]);
	
	const containerRef = useAutoScrollToBottom<HTMLDivElement>([props.log]);
	const viewport = useRef<HTMLDivElement>(null);

	const scrollToBottom = () =>
		viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'instant' });
	
	
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
							{props.playerID === '0' ? 
							<ConfirmButton variant="outline" description="undo" action={() => props.moves.customUndo()}>
								Undo last action
							</ConfirmButton> 
							: null}
							<Button onClick={handleEndGame}>End Game</Button>
							<Button onClick={scrollToBottom}>Scroll to bottom</Button>
						</Group>
					</Stack>
				</ComplexHeader>
			</Box>
			<ScrollAreaAutosize mih="0" scrollbars="y" m="md" viewportRef={viewport}>
				<Stack align="flex-start" pb="md" ref={containerRef}>
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
			</ScrollAreaAutosize>
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
			const dateObj = new Date(metadata.date);
			//just hour and minute, plus am/pm
			const time = dateObj.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
				});
			setTimestamp(time);
			return;
		} else {
			setTimestamp("Just now");
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
				return <P>{entry.action.payload.type}</P>;
		}
	};

	return (
		<Alert
			maw="80%"
			w="max-content"
			miw="40%"
			title={senderData.name}
			color={senderData.teamColor}
			bd="1px solid"
			ml={senderData.playerID === playerData.playerID ? "auto" : "0"}
			>
			<P fs="italic" mt="0" size="xs">
				<Span className="capitalize">{senderData.teamColor}</Span><Span> team</Span>
			</P>
			{Message()}
			<P fz="sm" >{timestamp}</P>
		</Alert>
	);
}

function ChallengeCompleted({ metadata }: { metadata: LogMetadata }) {
	const evidenceImages = metadata.evidence?.map(imageLink => {
		const fileType = imageLink.split('?')[0].split(".").pop();
		if(fileType && ["jpg", "png", "jpeg"].includes(fileType)){
			return (
		<ImageMantine
					key={imageLink}
					src={imageLink}
					alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
					w="min(100%, 300px)"
					
				/>
			)}
		return (
		<Box
					key={imageLink}
				>
					<ReactPlayer controls width="100%" url={imageLink}/>
				</Box>
		)
	});
	
	return (
		<>
			<p>
				<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> to {metadata.claimType || "claim"} <strong>{metadata.zoneName || metadata.zone}</strong> {metadata.stealFrom ? `from ${metadata.stealFrom}` : null}
			</p>
			<Stack>
			{metadata.evidence && evidenceImages}
			</Stack>
		</>
	);
}

function JoinedMatch({ senderData }: { senderData: PlayerData }) {
	return (
		<p>
			<Span fw="bold" fz={"md"}>{senderData.name}</Span> joined the
			match on the <Span fw="bold">{senderData.teamColor}</Span> team.
		</p>
	);
}

function GameStarted({ senderData }: { senderData: PlayerData }) {
	return (
		<p>
			<Span fw="bold">{senderData.name}</Span> started
			the game.
		</p>
	);
}
