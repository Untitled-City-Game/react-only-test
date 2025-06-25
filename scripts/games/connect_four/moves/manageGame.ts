import { gameTimeMinutes } from "@/scripts/consts";
import { MoveContext } from "@/scripts/games/connect_four/connect_four";
import { teamSetup } from "@/scripts/games/connect_four/moves/teamSetup";
import { createUndoPoint } from "@/scripts/games/undo";
import { GameState } from "@/scripts/types";
import { addLogMetadata } from "./metadata";

export function startGame(context: MoveContext) {
	const { events, G, random, log } = context;
	//shuffle and create decks
	events.setActivePlayers({ all: "claim" });
	teamSetup(context);
	startGameTimer(G);

	G.active = true;
	createUndoPoint(G);
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);
} 

export function startGameTimer(G: GameState) {
	const startTime = Date.now();
	G.startTime = startTime;
	G.endTime = startTime + gameTimeMinutes * 60 * 1000;
}

export function endGame({ G, log }: MoveContext) {
	console.log("ending game");
	log.setMetadata("game end");
	G.gameOver = true;
	G.active = false;
}

