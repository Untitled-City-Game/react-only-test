import { ConnectFour } from "@/scripts/connect_four";
import type { ClientSetupData, GameSetupData, MapData, PlayerData } from "@/scripts/types";
import Board from "@/src/match/boardGame/Board";
import Loading from "@/src/match/boardGame/Loading";
import { LobbyClient } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function ClientContainer(
	props: { children: React.ReactNode }
) {
	console.log("rendering client container")
	const [playerData, setPlayerData] = useState<PlayerData>();
	const [gameSetupData, setGameSetupData] = useState<GameSetupData>();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.GAME_SERVER }), []);
	//Check if session is already part of a game
	useEffect(() => {
		console.log("running localstorage playerdata effect")
		if (!playerData){
			const localPlayerData = localStorage.getItem("localPlayerData");
			if (localPlayerData){
				const loadedPlayerData = JSON.parse(localPlayerData) as PlayerData;
				console.log("setting player data from local storage", localPlayerData);
				setPlayerData(loadedPlayerData);
			}
		}
	}, [playerData]);
	
	//get map data if needed
	useEffect(() => {
		console.log("running mapdata effect")
		if(!gameSetupData && playerData?.matchID){
			lobbyClient.getMatch("connect-four", playerData.matchID).then(async res => {
				const cityName = res.setupData.city;
				console.log("city", cityName);
				const mapDataRes = await fetch(process.env.GAME_SERVER + "/map-data/" + cityName)
				const mapDataResJSON = await mapDataRes.json() as MapData;
				setGameSetupData({
					...mapDataResJSON,
					city: cityName
				});
				}
			);
		}
	}, [gameSetupData, lobbyClient, playerData]);
	
	//Render game
	if (playerData && gameSetupData){
		console.log("rendering game client");
		const GameClient = Client({
			game: ConnectFour,
			board: Board,
			debug: {
				collapseOnLoad: true,
			},
			multiplayer: SocketIO({
				server: process.env.GAME_SERVER,
			}),
			loading: Loading,
		}) as React.JSXElementConstructor<ClientSetupData>
		return (
			<ErrorBoundary fallback={<span>Something went wrong with the game client.</span>}>
			<GameClient matchID={playerData.matchID || "default"} playerData={{data: playerData, setter: setPlayerData}} playerID={playerData.playerID} credentials = {playerData.playerCredentials} {...gameSetupData} {...props} />
			</ErrorBoundary>
		)
	} else {
		console.log("no game setup data");
		return <>No game setup data here.</>
	}
}


//Styles to make map appear
const containerStyle = {
	width: "100%",
	height: "100%",
};

const mapStyles: React.CSSProperties = {
	flexBasis: "200px",
	flexGrow: 7,
};


const mapContainerStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	flexGrow: 10,
};