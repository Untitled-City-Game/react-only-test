import { ConnectFour } from "@/scripts/games/connect_four/connect_four";
import { Snake } from "@/scripts/games/snake/snake";
import { ClientSetupData, MatchMapData, MatchTeamColor, PlayerData } from "@/scripts/types/types";
import { ConnectFourBoard, SnakeBoard } from "@/src/match/Board";
import { Client } from "boardgame.io/react";
import Loading from "@/src/match/screens/game_status/Loading";
import { Button, MantineProvider, mergeMantineTheme } from "@mantine/core";
import { SocketIO } from "boardgame.io/multiplayer";
import { ErrorBoundary } from "react-error-boundary";
import { theme } from "@/src/styles/theme";
import { FormValues } from "@/src/lobby/CreateMatch/CreateMatchTemplate";
import { fetchMapData } from "@/scripts/fetchMapData";
import { joinMatch } from "@/scripts/joinMatch";
import { values } from "lodash";
import { LobbyClient } from "boardgame.io/client";
import { useEffect, useMemo, useState } from "react";

export default function ConnectFourDemo() {
	const [playerData, setPlayerData] = useState<PlayerData | undefined>()
	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	async function demoGameSetup() {

		//Get game data
		const ConnectFourSetupData = async (values: FormValues) => {
			const mapSetupData: MatchMapData = await fetchMapData(values.city);
			console.log("got london map data", mapSetupData);
			const setupData = {
				mapSetupData,
				gameName: values.gameName
			}
			return setupData;
		};

		const testSetupData = await ConnectFourSetupData({
			PlayerName: "Demo Player",
			teamColor: "red",
			gameName: "connect_four_demo",
			city: "london"
		})

		console.log("Got map setup data", testSetupData.mapSetupData)

		const { matchID } = await lobbyClient.createMatch("connect_four", {
			numPlayers: 20,
			setupData: testSetupData
		});

		//Join game
		const playerData: PlayerData = await joinMatch(
			lobbyClient,
			"connect_four",
			matchID,
			"Demo Player",
			"red",
			true
		);
		console.log("player data", playerData)
		return playerData
	}

	function saveDemoData() {
		demoGameSetup().then(
			newPlayerData => setPlayerData(newPlayerData)
		)
	}

	useEffect(() => {
		saveDemoData()
	}, [])
	//Create client
	if (!playerData) return (
		<>
			<p>No player data found</p>
		</>
	)

	//Create game
	const DemoGame = Client({
		game: ConnectFour,
		board: ConnectFourBoard,
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
		<MantineProvider theme={clientTheme}>
		<DemoGame
			matchID={playerData.matchID || "default"}
			gameCode={playerData.gameCode || "default"}
			playerData={{ data: playerData, setter: setPlayerData }}
			credentials={playerData.playerCredentials}
			playerID={playerData.playerID}
			/>
			</MantineProvider>
		
	)
}

