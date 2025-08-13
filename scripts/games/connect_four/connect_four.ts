import { completeChallenge, completeChallengeAndClaim } from "@/scripts/games/connect_four/moves/completeChallengeAndClaim";
import { discardChallenge, discardHand } from "@/scripts/games/challenge_deck/handManagement";
import { endGame, startGame } from "@/scripts/games/shared_moves/manageGame";
import { ConnectFourGameSetup, connectFourPlayerSetup } from "@/scripts/games/connect_four/setup";
import customUndoTemplate from "@/scripts/games/undo";
import {
	GameSetupData,
	StripContext,
	MoveContext
} from "@/scripts/types/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";
import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { challengeDeckTeamSetup } from "@/scripts/games/challenge_deck/challenge_deck_team_setup";

export const handSize = 5;

const customUndo = (context : MoveContext<ConnectFourGameState>) => {
	customUndoTemplate(context)
}

const claimStateMoves = {
	playerSetup: connectFourPlayerSetup,
	discardChallenge,
	discardHand,
	completeChallenge,
	completeChallengeAndClaim,
	endGame,
	customUndo
};
export type ClaimStateMoves = StripContext<typeof claimStateMoves>;

export const ConnectFour: Game<ConnectFourGameState> = {
	name: `connect_four`,
	//set up game board using map json info
	// validateSetupData: (data) => isGameSetupData(data),
	setup: ({ ctx }, setupData : GameSetupData) => ConnectFourGameSetup(ctx, setupData),
	endIf: ({ G }) => {
		console.log("gameover check", G.gameOver);
		return G.gameOver ? "Game ended" : null;
	},
	onEnd: () => {
		console.log("on end");
	},
	moves: {
		startGame : (args: any) => startGame<ConnectFourGameState>(args),
		playerSetup: connectFourPlayerSetup
	},
	turn: {
		onBegin: ({ events }) => {
			events.setActivePlayers({ all: "join" });
		},
		stages: {
			join: {
				moves: {
					playerSetup: connectFourPlayerSetup,
					startGame : (args: any) => {
						challengeDeckTeamSetup(args)
						startGame<ConnectFourGameState>(args)
					},
				},
			},
			claim: {
				moves: claimStateMoves,
			},
		},
	},
}



