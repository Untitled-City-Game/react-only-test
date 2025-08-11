import { discardChallenge, discardHand } from "@/scripts/games/shared_moves/handManagement";
import { endGame } from "@/scripts/games/shared_moves/manageGame";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";
import { snakeGameSetup } from "@/scripts/games/snake/setup";
import { SnakeGameSetupData, SnakeGameState } from "@/scripts/games/snake/types";
import customUndo from "@/scripts/games/undo";
import { StripContext } from "@/scripts/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";

const playStateMoves_Snake = {
	playerSetup,
	discardChallenge,
	discardHand,
	endGame,
	customUndo
};
export type PlayStateMoves_Snake = StripContext<typeof claimStateMoves>;

export const Snake: Game<SnakeGameState> = {
	name: `snake`,
	setup: ({ ctx }, setupData : SnakeGameSetupData) => snakeGameSetup(ctx, setupData),
	endIf: ({ G }) => {
		console.log("gameover check", G.gameOver);
		return G.gameOver ? "Game ended" : null;
	},
	
	moves: {
		startGame,
		playerSetup,
	},
	
	turn: {
		onBegin: ({ events }) => {
			events.setActivePlayers({ all: "join" });
		},
		stages: {
			join: {
				moves: {
					playerSetup,
					startGame,
				},
			},
			play: {
				moves: playStateMoves_Snake,
			},
		},
	},
}
