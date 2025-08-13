import { endGame, startGame } from "@/scripts/games/shared_moves/manageGame";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";
import { snakeGameSetup } from "@/scripts/games/snake/setup";
import { snakePlayerSetup } from "@/scripts/games/snake/snakePlayerSetup";
import { SnakeGameSetupData, SnakeGameState } from "@/scripts/games/snake/types";
import customUndoTemplate from "@/scripts/games/undo";
import { MoveContext, StripContext } from "@/scripts/types/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";

const customUndo = (context : MoveContext<SnakeGameState>) => {
	customUndoTemplate(context)
}
const playStateMoves_Snake = {
	snakePlayerSetup,
	endGame,
	customUndo,
	playerSetup : snakePlayerSetup
};
export type PlayStateMoves_Snake = StripContext<typeof playStateMoves_Snake>;

export const Snake: Game<SnakeGameState> = {
	name: `snake`,
	setup: ({ ctx }, setupData : SnakeGameSetupData) => snakeGameSetup(ctx, setupData),
	endIf: ({ G }) => {
		console.log("gameover check", G.gameOver);
		return G.gameOver ? "Game ended" : null;
	},
	
	moves: {
		startGame : (args: any) => startGame<SnakeGameState>(args),
		playerSetup: playerSetup,
	},
	
	turn: {
		onBegin: ({ events }) => {
			events.setActivePlayers({ all: "join" });
		},
		stages: {
			join: {
				moves: {
					playerSetup: snakePlayerSetup,
					startGame : (args: any) => startGame<SnakeGameState>(args),
				},
			},
			play: {
				moves: playStateMoves_Snake,
			},
		},
	},
}
