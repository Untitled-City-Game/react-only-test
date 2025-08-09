import { ConnectFour } from "@/scripts/games/connect_four/connect_four";
import type { ClientSetupData, PlayerData } from "@/scripts/types";
import Board from "@/src/match/boardGame/Board";
import Loading from "@/src/match/boardGame/Loading";
import { theme } from "@/src/styles/theme";
import { MantineProvider, mergeMantineTheme } from "@mantine/core";
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router";
import { socket } from "@/scripts/socket"
export default function ClientContainer(props: { children: React.ReactNode }) {
	const [playerData, setPlayerData] = useState<PlayerData>();
	const navigate = useNavigate();
	
	//Check if session is already part of a game
	useEffect(() => {
		console.log("running localstorage playerdata effect");
		if (!playerData) {
			const localPlayerData = localStorage.getItem("localPlayerData");
			if (localPlayerData) {
				const loadedPlayerData = JSON.parse(
					localPlayerData
				) as PlayerData;
				console.log(
					"setting player data from local storage",
					localPlayerData
				);
				setPlayerData(loadedPlayerData);
			} else {
				console.log("no player data in local storage");
				navigate("/lobby");
			}
		}
	}, [playerData]);

	// //Render game
	if (playerData) {
		const GameClient = Client({
			game: ConnectFour,
			board: Board,
			debug: false,
			multiplayer: SocketIO({
				server: process.env.GAME_SERVER,
			}),
			loading: Loading,
		}) as React.JSXElementConstructor<ClientSetupData>;

		const clientTheme = mergeMantineTheme(theme, {
			primaryColor: playerData.teamColor,
			primaryShade: 6,
		});
		

		return (
			<>
			<MantineProvider theme={clientTheme}>
				<ErrorBoundary
					fallback={
						<span>Something went wrong with the game client.</span>
					}>
					<GameClient
						matchID={playerData.matchID || "default"}
						gameCode="connect_four"
						playerData={{ data: playerData, setter: setPlayerData }}
						playerID={playerData.playerID}
						credentials={playerData.playerCredentials}
						{...props}
					/>
				</ErrorBoundary>
			</MantineProvider>
			</>
		);
	} else {
		console.log("no player data");
		return <>No player data found.</>;
	}
}

