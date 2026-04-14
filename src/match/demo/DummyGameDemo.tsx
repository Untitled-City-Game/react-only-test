import { DummyGameState } from "@/scripts/games/connect_four/dummy_game";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { Client } from "boardgame.io/react";
import { useState, useMemo, useEffect } from "react";
import { SocketIO } from "boardgame.io/multiplayer";
import { GameBoardContextSpecific, MatchTeamColor } from "@/scripts/types/types";

// export default function DummyGameDemo(){

// 	const [playerData, setPlayerData] = useState<LobbyAPI.JoinedMatch | undefined>()
// 	const lobbyClient = useMemo(
// 			() => new LobbyClient({ server: process.env.GAME_SERVER }),
// 			[]
// 		);

// 	async function dummyGameSetup(){
// 		const { matchID } = await lobbyClient.createMatch("dummy_game", {
// 			numPlayers: 20,
// 		});
// 		//Join game
// 		const playerData = await lobbyClient.joinMatch("dummy_game", matchID, {playerName: "Demo Player"})
// 		return playerData
// 	}

// 	useEffect(() => {
// 		dummyGameSetup().then(newPlayerData => setPlayerData(newPlayerData))
// 	}, [])

// 	if(!playerData) return (
// 		<>Dummy game demo</>
// 	)

// 	const DummyClient = Client({
// 		game: DummyGame,
// 		board: DummyBoard,
// 		debug: false,
// 		multiplayer: SocketIO({
// 			server: process.env.GAME_SERVER,
// 		}),
// 	})

// 	return(
// 		<DummyClient playerData={{data: {
// 			playerID: "0",
// 			name: "Demo Player",
// 			teamColor: "red" as MatchTeamColor
// 		}}} gameCode={"dummy_game"} />
// 	)
// }

// function DummyBoard(props: GameBoardContextSpecific<DummyGameState>){
// 	return (
// 		<>Game State: {props.G.bar}</>
// 	)
// }