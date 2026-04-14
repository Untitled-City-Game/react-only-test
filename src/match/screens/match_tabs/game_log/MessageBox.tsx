import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { GameStateAnything, LogMetadata, PlayerData } from "@/scripts/types/types";
import { ChallengeEvidence } from "@/src/match/screens/match_tabs/game_log/messages/ChallengeCompleted";
import { theme } from "@/src/styles/theme";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Alert, Avatar, Box, Group, Stack } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import React, { useEffect, useState } from "react";


export function MessageContainer({myMessage, children}: {
	myMessage?: boolean;
	children: React.ReactNode
}){
	return (
		<Group w="100%" wrap="nowrap" gap="xs" align="flex-start"  style={{
			flexDirection: myMessage ? "row-reverse" : "row",
		}}>
			{children}
		</Group>
	)
}

export function MessageBox({
	entry, gameData, playerData, children, unstyled, evidence
}: {
	entry: LogEntry;
	gameData: GameStateAnything;
	playerData: PlayerData;
	children: React.ReactNode;
	unstyled?: boolean;
	evidence?: boolean
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
	const myMessage = senderData.playerID === playerData.playerID
	return (
		<>
		<MessageContainer myMessage={myMessage}>
			<Avatar radius="sm" size="sm" src={gameData.teamPhotoURLs[senderData.teamColor]} color={senderData.teamColor} name={`${senderData.teamColor} Team`} alt={`${senderData.teamColor} Team`} />
			<Stack gap="0" align={myMessage ? "flex-end" : "flex-start"}>
				<MessageWrapper
					entry={entry}
					gameData={gameData}
					playerData={playerData}
					unstyled={unstyled}
				>
					<Group w="100%" justify="space-between">		
						<P fz="sm"><Span fw="bold" c={theme.colors[senderData.teamColor][6]}>{senderData.name}</Span> | <Span fz="xs" fs="italic" className="capitalize">{senderData.teamColor}</Span>
						</P>	
						<P fz="sm">{timestamp}</P>
					</Group>
					{children}
				</MessageWrapper>
				{evidence ? 
				<ChallengeEvidence metadata={entry.metadata as LogMetadata} myMessage={myMessage} /> 
				: null
				}
			</Stack>
		</MessageContainer>

		</>
	);
}

export function MessageWrapper({
	entry, gameData, playerData, children, unstyled
}: {
	entry: LogEntry;
	gameData: GameStateAnything;
	playerData: PlayerData;
	children: React.ReactNode;
	unstyled?: boolean;
}){
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	return (
	
			<Box
				maw="80%"
				// w="max-content"
				miw="40%"
				mb="5px"
				bg={unstyled? "none" : theme.colors[senderData.teamColor][0]}
				style={{
					// border: borderStyle,
					borderRadius: "10px",
					padding: `${unstyled ? "0" :"10px 10px 10px 10px"}`,
					justifySelf: senderData.playerID === playerData.playerID ? "flex-end" : "flex-start"
				}}
			>
			{children}
			</Box>
	)
}
