import { MoveContext, GameStateUniversal } from "@/scripts/types/types";

export default function customUndoTemplate(context: MoveContext<GameStateUniversal>){
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

export function createUndoPoint<GameState extends GameStateUniversal>(G: GameState){
	console.log("create undo point");
	const {gameStateLogs, ...rest} = G;
	G.gameStateLogs.push(rest);
	//remove undo points
	if(G.gameStateLogs.length > 3){
		G.gameStateLogs.shift();
	}
}