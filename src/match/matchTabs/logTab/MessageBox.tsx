import { GameState, LogMetadata, PlayerData } from "@/scripts/types";
import P from "@/src/userInterface/P";
import Span from "@/src/userInterface/Span";
import { Alert } from "@mantine/core";
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
			{children}
			<P fz="sm">{timestamp}</P>
		</Alert>
	);
}
