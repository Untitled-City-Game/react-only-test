import { MetroGameBoardProps, MetroGameContext } from "@/scripts/types";
import GameOver from "@/src/lobby/GameOver";
import Loading from "@/src/match/boardGame/Loading";
import Waiting from "@/src/match/boardGame/Waiting";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const GameContext = createContext({} as MetroGameContext);
export default function Board(props: MetroGameBoardProps) {
	console.log("attempting to render board", props);
	const { children, ...boardGameContext }  = props;
	const { moves, playerID } = props;
	const playerData = props.playerData.data;
	let navigate = useNavigate();
	const [worker, setWorker] = useState<ServiceWorkerRegistration>()
	useEffect(() => {
			if ('serviceWorker' in navigator) {
				console.log("service workers in navigator");
				navigator.serviceWorker.register(
					new URL('service-worker.js', import.meta.url),
					{ type: 'module' }
				).then(worker => setWorker(worker));
			}
		}, []);
	useEffect(() => {
		console.log("zone data effect");
		if(worker){
			const latestUpdate = boardGameContext.log.slice(-1)[0];
			const metadata = latestUpdate.metadata;
			if(!metadata) return;
			let title = ""
			let body = ""
			console.warn("notification effect", metadata.team, playerData.teamColor)
			if(metadata.team === playerData.teamColor){
				return;
			}
			switch (latestUpdate.action.payload.type) {
				case "completeChallengeAndClaim":
					title = "Neighbourhood claimed!"
				 	body = `${metadata.team} team completed challenge ${metadata.challenge} to ${metadata.claimType || "claim"} ${metadata.zoneName || metadata.zone} ${metadata.stealFrom ? `from ${metadata.stealFrom}` : null}`
					break;
				case "startGame":
					title = "The game has started!"
					break;
				default:
					return;
			}
			worker.showNotification(title, {body});
		} else {
			console.warn("no service worker found")
		}
	}, [boardGameContext.G.zoneData]);
	
	useEffect(() => {
		if (playerID && !props.G.allPlayersData[playerID]) {
			console.timeLog("load", "player setup");
			console.log(
				"setting up player ",
				playerID,
				playerData,
				"on client"
			);
			moves.playerSetup(playerData);
		}
	}, [playerID, moves, playerData, props.G.allPlayersData]);

	if (props.G.gameOver) {
		return <GameOver />;
	}

	if (!playerID){
		navigate("/lobby");
	}

	if (!props.G.active) {
		return (
			<GameContext.Provider value={{ ...boardGameContext }}>
				<Waiting />
			</GameContext.Provider>
		);
	}

	if (playerID && !props.G.allPlayersData[playerID]) {
		return <Loading message="Looking for local player data" />;
	}

	return (
		<GameContext.Provider value={{ ...boardGameContext }}>
			{/* <p>Player ID: {playerID}</p>
			<p>
				Team: {playerID && props.G.allPlayersData[playerID].teamColor}
			</p>
			<p>Game state: {props.G.active ? "active" : "inactive"}</p>
			<p>Gameover: {props.G.gameOver ? "true" : "false"}</p> */}
			{children}
		</GameContext.Provider>
	);
}
