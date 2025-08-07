import { GameState, LogMetadata, PlayerData } from "@/scripts/types";
import { theme } from "@/src/styles/theme";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Alert, Box, Group } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import React, { useEffect, useState } from "react";

export function MessageBox({
	entry, gameData, playerData, children
}: {
	entry: LogEntry;
	gameData: GameState;
	playerData: PlayerData;
	children: React.ReactNode;
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

	return (
		<MessageWrapper
			entry={entry}
			gameData={gameData}
			playerData={playerData}
		>
			<Group w="100%" justify="space-between">		
				<P fz="sm"><Span fw="bold" c={theme.colors[senderData.teamColor][6]}>{senderData.name}</Span> | <Span fz="xs" fs="italic" className="capitalize">{senderData.teamColor}</Span>
				</P>	
				<P fz="sm">{timestamp}</P>
			</Group>
			{children}
		</MessageWrapper>
	);
}

export function MessageWrapper({
	entry, gameData, playerData, children, unstyled
}: {
	entry: LogEntry;
	gameData: GameState;
	playerData: PlayerData;
	children: React.ReactNode;
	unstyled?: boolean;
}){
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	//const borderStyle = unstyled ? "none" : `1px solid ${theme.colors[senderData.teamColor][2]}`
	return (
		<Box
			maw="80vw"
			w="max-content"
			miw="40%"
			mb="5px"
			bg={unstyled? "none" : theme.colors[senderData.teamColor][0]}
			style={{
				// border: borderStyle,
				borderRadius: "10px",
				padding: `${unstyled ? "0" :"10px 10px 10px 10px"}`,
			}}
			ml={senderData.playerID === playerData.playerID ? "auto" : "0"}
		>{children}</Box>
	)
}
