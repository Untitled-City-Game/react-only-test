import { MetroGameBoardProps } from "@/scripts/types";
import GameOver from "@/src/lobby/GameOver";
import Loading from "@/src/match/boardGame/Loading";
import Waiting from "@/src/match/boardGame/Waiting";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router";

export const GameContext = createContext({} as MetroGameBoardProps);
export default function Board(props: MetroGameBoardProps) {
	console.log("attempting to render board");
	const { children, ...rest } = props;
	const { moves, playerID } = props;
	const playerData = props.playerData.data;
	let navigate = useNavigate();
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
			<GameContext.Provider value={{ ...rest }}>
				<Waiting />
			</GameContext.Provider>
		);
	}

	if (playerID && !props.G.allPlayersData[playerID]) {
		return <Loading message="Looking for local player data" />;
	}

	return (
		<GameContext.Provider value={{ ...rest }}>
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
