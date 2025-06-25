import { MoveContext } from "@/scripts/games/connect_four/connect_four";
import { GameState } from "@/scripts/types";

export default function customUndo(context: MoveContext){
	console.log("custom undo activated");
	let G = context.G;
	const gameStateLogs = G.gameStateLogs;
	if(gameStateLogs.length <= 1){
		console.log("Can't undo, no history")
		return "INVALID_MOVE";
	}
	const lastState = G.gameStateLogs[G.gameStateLogs.length - 2];
	if(!lastState){
		throw new Error("Type of laststate was not expected");
	}
	return {
		gameStateLogs: G.gameStateLogs.slice(0,-1),
		...lastState,
	}
}

export function createUndoPoint(G: GameState){
	const {gameStateLogs, ...rest} = G;
	G.gameStateLogs.push(rest);
}