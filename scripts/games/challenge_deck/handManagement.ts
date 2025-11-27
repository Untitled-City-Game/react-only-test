import { Challenge, ChallengeGameGameState, RawChallenge, TeamChallengeData } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { handSize } from "@/scripts/games/connect_four/connect_four";
import { addLogMetadata } from "@/scripts/games/shared_moves/metadata";
import { createUndoPoint } from "@/scripts/games/undo";
import { MatchTeamColor, MoveContext } from "@/scripts/types/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import challengeDataGeneric from 'data/challenges/challenges_generic.json';
import challengeDataMelbourne from 'data/challenges/challenges_melbourne.json';
import challengeDataMontreal from 'data/challenges/challenges_montreal.json';
import challengeDataLondon from 'data/challenges/challenges_london.json'
import { remove } from "lodash";

export function discardChallenge(
	{ G, playerID }: { G: ChallengeGameGameState; log: LogAPI; playerID: string; },
	challenge: string
) {
	const team = G.allPlayersData[playerID].teamColor;
	//remove challenge from challenge hand
	const teamData = G.allTeamsChallengeData[team];
	const removedChallenge = remove(
		teamData.challengeHand,
		(challengeInHand) => challengeInHand.title === challenge
	);
	teamData.challengeDiscard.concat(removedChallenge);
}

export function drawChallenge({ G, playerID }: { G: ChallengeGameGameState; playerID: string; }, teamData: TeamChallengeData) {
	//check numbers of hard vs normal challenges
	const hardChallenges = teamData.challengeHand.filter(challenge => challenge.hard).length

	if (teamData.challengeDeck.length === 0) {
		console.log("no cards left in deck");
		return("NO_CARDS")
	}

	//draw a challenge from deck
	let drawnChallenge : Challenge;
	if (hardChallenges === 0) {
		//draw hard challenge
		const hardChallenge = teamData.challengeDeck.findIndex(challenge => challenge.hard);
		if (hardChallenge !== -1) {
			drawnChallenge = teamData.challengeDeck.splice(hardChallenge, 1)[0];
		} else {
			drawnChallenge = teamData.challengeDeck.pop()!;
		}
	}
	else if (hardChallenges >= 2) {
		//draw a regular challenge
		const normalChallenge = teamData.challengeDeck.findIndex(challenge => !challenge.hard);
		if (normalChallenge !== -1) {
			drawnChallenge = teamData.challengeDeck.splice(normalChallenge, 1)[0];
		} else {
			drawnChallenge = teamData.challengeDeck.pop()!;
		}
	} else {
		//draw a random challenge
		drawnChallenge = teamData.challengeDeck.pop()!;
	}
	teamData.challengeHand.unshift(drawnChallenge);
	console.log("drawn challenge", drawnChallenge.title);
}

export function drawToFull({ G, playerID }: MoveContext<ChallengeGameGameState>, team?: MatchTeamColor) {
	console.log("drawing to full", team);
	const teamData = team ? G.allTeamsChallengeData[team] : G.allTeamsChallengeData[G.allPlayersData[playerID].teamColor];
	while (teamData.challengeHand.length < handSize) {
		const errorCheck = drawChallenge({ G, playerID }, teamData);
		if(errorCheck === "NO_CARDS") {
			break;
		}
	}
}

export function discardHand(context: MoveContext<ChallengeGameGameState>) {
	const { G, playerID, log } = context;
	const team = G.allPlayersData[playerID].teamColor;
	const teamData = G.allTeamsChallengeData[team];
	
	//Don't discard if 0 challenges left
	if(teamData.challengeDeck.length === 0){
		return "INVALID_MOVE"
	}
	
	teamData.challengeDiscard.concat(teamData.challengeHand);
	teamData.challengeHand = [];
	drawToFull(context);
	createUndoPoint(G);
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);

}

export function createChallengeDeck(city: string, winter?: boolean) {
	const genericChallengeData = challengeDataGeneric as RawChallenge[]
	const allChallengeData = genericChallengeData.concat(getCityChallenges(city))
	const filteredChallengeData = winter ? allChallengeData.filter(challenge => !challenge.exclude_winter) : allChallengeData
	const structuredChallengeData = structureChallenges(filteredChallengeData);
	return structuredChallengeData;
}

function getCityChallenges(city: string){
		switch (city) {
		case "melbourne":
			return challengeDataMelbourne as RawChallenge []
		case "montreal":
			return challengeDataMontreal as RawChallenge []
		case "london":
			return challengeDataLondon as RawChallenge []
		default:
			return []
	}
}

function structureChallenges(challengeData : RawChallenge[]) : Challenge[]{
	return challengeData.map(challenge => {
		return {
			title: challenge.title,
			description: challenge.description,
			hard : challenge.hard,
			emoji: challenge.emoji,
			rules: [challenge.rule1, challenge.rule2, challenge.rule3, challenge.rule4],
			link: {
				name: challenge.link_name,
				url: challenge.link
			}
		} as Challenge
	})
}
