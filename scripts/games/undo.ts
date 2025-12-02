import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { MoveContext, GameStateUniversal } from "@/scripts/types/types";

export default function customUndoTemplate(context: MoveContext<ConnectFourGameState>){
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
	console.log("current state", JSON.stringify(G.zoneData,null,4));
	console.log("last state", JSON.stringify(lastState.zoneData,null,4));
	return {
		gameStateLogs: G.gameStateLogs.slice(0,-1),
		...lastState,
	}
}

export function createUndoPoint<GameState extends GameStateUniversal>(G: GameState){
	const {gameStateLogs, ...rest} = G;
	G.gameStateLogs.push(rest);
}