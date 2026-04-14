import { MoveContext, GameStateUniversal } from "@/scripts/types/types";

export default function customUndoTemplate<T extends GameStateUniversal>(context: MoveContext<T>): T | "INVALID_MOVE" {
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
	} as T
}

export function createUndoPoint<GameState extends GameStateUniversal>(G: GameState){
	const {gameStateLogs, ...rest} = G;
	G.gameStateLogs.push(rest);
}