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


export type RawChallenge = {
	title: string,
	description: string,
	emoji: string,
	rule1: string,
	rule2: string,
	rule3: string,
	rule4: string
	link: string,
	link_name: string,
	hard?: string,
	exclude_winter?: string,
}

export type Challenge = {
	title: string,
	description: string,
	emoji: string,
	rules: string[],
	link: {
		name: string,
		url: string
	}
	hard?: string,
}