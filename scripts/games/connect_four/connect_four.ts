import { completeChallenge, completeChallengeAndClaim } from "@/scripts/games/connect_four/moves/completeChallengeAndClaim";
import { discardChallenge, discardHand } from "@/scripts/games/connect_four/moves/handManagement";
import { endGame, startGame } from "@/scripts/games/connect_four/moves/manageGame";
import { playerSetup } from "@/scripts/games/connect_four/moves/playerSetup";
import { gameSetup } from "@/scripts/games/connect_four/setup";
import customUndo from "@/scripts/games/undo";
import {
	GameSetupData,
	GameState,
	StripContext
} from "@/scripts/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";

export type MoveContext = DefaultPluginAPIs & { G: GameState; ctx: Ctx; playerID: string };

export const handSize = 5;

const claimStateMoves = {
	playerSetup,
	discardChallenge,
	discardHand,
	completeChallenge,
	completeChallengeAndClaim,
	endGame,
	customUndo
};
export type ClaimStateMoves = StripContext<typeof claimStateMoves>;

export const ConnectFour: Game<GameState> = {
	name: `connect-four`,
	//set up game board using map json info
	// validateSetupData: (data) => isGameSetupData(data),
	setup: ({ ctx }, setupData : GameSetupData) => gameSetup(ctx, setupData),
	endIf: ({ G }) => {
		console.log("gameover check", G.gameOver);
		return G.gameOver ? "Game ended" : null;
	},
	onEnd: () => {
		console.log("on end");
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
			claim: {
				moves: claimStateMoves,
			},
		},
	},
}



