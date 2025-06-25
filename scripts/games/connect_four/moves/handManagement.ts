import { MoveContext, handSize } from "@/scripts/games/connect_four/connect_four";
import { createUndoPoint } from "@/scripts/games/undo";
import { AllChallengeData, Challenge, GameState, MatchTeamColor, TeamData } from "@/scripts/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import challengeDataGeneric from 'data/challenges/challenges_generic.json';
import challengeDataMelbourne from 'data/challenges/challenges_melbourne.json';
import { remove } from "lodash";
const challengeDataMontreal: AllChallengeData = []
const challengeDataLondon: AllChallengeData = []


export function discardChallenge(
	{ G, playerID }: { G: GameState; log: LogAPI; playerID: string; },
	challenge: string
) {
	const team = G.allPlayersData[playerID].teamColor;
	//remove challenge from challenge hand
	const teamData = G.allTeamsData[team];
	const removedChallenge = remove(
		teamData.challengeHand,
		(challengeInHand) => challengeInHand.title === challenge
	);
	teamData.challengeDiscard.concat(removedChallenge);
}

export function drawChallenge({ G, playerID }: { G: GameState; playerID: string; }, teamData: TeamData) : Challenge {
	//check numbers of hard vs normal challenges
	const hardChallenges = teamData.challengeHand.filter(challenge => challenge.hard).length

	if (teamData.challengeDeck.length === 0) {
		console.log("no cards left in deck")
		throw new Error("deck empty");
	}

	//draw a challenge from deck
	let drawnChallenge;
	if (hardChallenges === 0) {
		//draw first hard challenge
		const hardChallenge = teamData.challengeDeck.findIndex(challenge => challenge.hard);
		if (hardChallenge !== -1) {
			drawnChallenge = teamData.challengeDeck.splice(hardChallenge, 1)[0];
		} else {
			drawnChallenge = teamData.challengeDeck.pop();
		}
	}
	else if (hardChallenges >= 3) {
		const normalChallenge = teamData.challengeDeck.findIndex(challenge => !challenge.hard);
		if (normalChallenge !== -1) {
			drawnChallenge = teamData.challengeDeck.splice(normalChallenge, 1)[0];
		} else {
			drawnChallenge = teamData.challengeDeck.pop();
		}
	} else {
		//draw a random challenge
		drawnChallenge = teamData.challengeDeck.pop();
	}

	if (drawnChallenge) {
		teamData.challengeHand.push(drawnChallenge);
		console.log("drawn challenge", drawnChallenge.title);
		return drawnChallenge;
	} else {
		console.log("no cards left in deck");
		throw new Error("deck empty");
	}
}

export function drawToFull({ G, playerID }: MoveContext, team?: MatchTeamColor) {
	console.log("drawing to full", team);
	const drawnChallenges : Challenge[] = []
	let i = 0;
	const teamData = team ? G.allTeamsData[team] : G.allTeamsData[G.allPlayersData[playerID].teamColor];
	while (teamData.challengeHand.length < handSize) {
		drawnChallenges.push(drawChallenge({ G, playerID }, teamData));
		i++;
		if (i > handSize) {
			console.log("error: couldn't draw to full");
			break;
		}
	}
	return drawnChallenges;
}

export function discardHand(context: MoveContext) {
	const { G, playerID } = context;
	const team = G.allPlayersData[playerID].teamColor;
	const teamData = G.allTeamsData[team];
	teamData.challengeDiscard.concat(teamData.challengeHand);
	teamData.challengeHand = [];
	drawToFull(context);
	createUndoPoint(G);
}

export function createChallengeDeck(city: string) {
	const challengeData = challengeDataGeneric as AllChallengeData
	switch (city) {
		case "melbourne":
			return challengeData.concat(challengeDataMelbourne)
		case "montreal":
			return challengeData.concat(challengeDataMontreal)
		case "london":
			return challengeData.concat(challengeDataLondon)
		default:
			return challengeData
	}
}
