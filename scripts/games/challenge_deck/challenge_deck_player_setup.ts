import {  MoveContext, PlayerData } from "@/scripts/types/types";
import { ChallengeGameGameState, TeamChallengeData } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { newTeamChallengeData } from "@/scripts/games/challenge_deck/challenge_deck_team_setup";

export function challengeDeckPlayerSetup(
	context: MoveContext<ChallengeGameGameState>,
	newPlayerData: PlayerData
) {
	console.log("challenge deck player setup", context.G)
	if(!context.G.allTeamsChallengeData[newPlayerData.teamColor]){
		context.G.allTeamsChallengeData[newPlayerData.teamColor] = newTeamChallengeData()
	}
}

