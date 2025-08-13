import { GameStateUniversal, MatchTeamString } from "@/scripts/types/types";

export interface ChallengeDeck{
	challengeDeck : Challenge[]
	allTeamsChallengeData: 	{[key in MatchTeamString] : TeamChallengeData}
}

export type TeamChallengeData = {
		challengeDeck : Challenge[];
		challengeHand : Challenge[];
		challengeDiscard : Challenge[];
	}

export interface ChallengeGameGameState extends GameStateUniversal, ChallengeDeck{}


export type Challenge = {
	title: string,
	description: string,
	emoji: string,
	evidence_text?: string,
	hard?: string,
}