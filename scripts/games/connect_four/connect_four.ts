import { completeChallenge, completeChallengeAndClaim } from "@/scripts/games/connect_four/moves/completeChallengeAndClaim";
import { discardChallenge, discardHand } from "@/scripts/games/shared_moves/handManagement";
import { endGame, startGame } from "@/scripts/games/shared_moves/manageGame";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";
import { gameSetup } from "@/scripts/games/connect_four/setup";
import customUndoTemplate from "@/scripts/games/undo";
import {
	GameSetupData,
	ConnectFourGameState,
	StripContext,
	GameStateUniversal,
	MoveContext
} from "@/scripts/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";

export const handSize = 5;

const customUndo = (context : MoveContext<ConnectFourGameState>) => {
	customUndoTemplate<ConnectFourGameState>(context)
}

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

export const ConnectFour: Game<ConnectFourGameState> = {
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
		startGame : (args: any) => startGame<ConnectFourGameState>(args),
		playerSetup
	},
	turn: {
		onBegin: ({ events }) => {
			events.setActivePlayers({ all: "join" });
		},
		stages: {
			join: {
				moves: {
					playerSetup,
					startGame : (args: any) => startGame<ConnectFourGameState>(args),
				},
			},
			claim: {
				moves: claimStateMoves,
			},
		},
	},
}



