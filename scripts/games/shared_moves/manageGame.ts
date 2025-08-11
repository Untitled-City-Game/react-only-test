import { gameTimeMinutes } from "@/scripts/consts";
import { teamSetup } from "@/scripts/games/shared_moves/teamSetup";
import { createUndoPoint } from "@/scripts/games/undo";
import { ConnectFourGameState, GameStateUniversal, MoveContext } from "@/scripts/types";
import { addLogMetadata } from "./metadata";

export function startGame<GameState extends GameStateUniversal>(context: MoveContext<GameState>) {
	console.log("starting game")
	const { events, G, random, log } = context;
	//shuffle and create decks
	events.setActivePlayers({ all: "claim" });
	teamSetup(context);
	startGameTimer<GameState>(G);
	createUndoPoint<GameState>(G);
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);
} 

export function startGameTimer<SomeGameState extends GameStateUniversal>(G: SomeGameState) {
	const startTime = Date.now();
	G.startTime = startTime;
	G.endTime = startTime + gameTimeMinutes * 60 * 1000;
}

export function endGame({ G, log }: MoveContext<GameStateUniversal>) {
	console.log("ending game");
	log.setMetadata("game end");
	G.gameOver = true;
}

