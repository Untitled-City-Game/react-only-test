import { MoveContext } from "@/scripts/games/connect_four/connect_four";
import { createUndoPoint } from "@/scripts/games/undo";
import { Challenge, GameState } from "@/scripts/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import { discardChallenge } from "./handManagement";
import { addLogMetadata } from "./metadata";

export function completeChallengeAndClaim(
	context: MoveContext,
	zoneID: number,
	challenge: string,
	evidence: string[]
) {
	const { G, log, playerID } = context;
	completeChallenge({ G, log, playerID }, challenge, evidence);
	const challengeInfo = G.challengeDeck.find(challengeInfo => challengeInfo.title === challenge);
	if (challengeInfo === undefined) {
		throw new Error(`Challenge ${challenge} not found`);
	}
	console.log("complete challenge and claim move found challenge ", challengeInfo);
	const claimData = claimZone({ G, log, playerID }, zoneID, challengeInfo);
	if(claimData === "INVALID_MOVE") return claimData;
	createUndoPoint(G);
	addLogMetadata(
		{ log },
		{
			zone: zoneID,
			zoneName: G.zoneData[zoneID].name,
			team: G.allPlayersData[playerID].teamColor,
			challenge: challengeInfo.title,
			evidence,
		}
	);
}

function removeChallenges(challengeHand: Challenge[], challengesToRemove: Challenge[]) {
	return challengeHand.filter(challenge =>
		!challengesToRemove.find(challengeToRemove =>
			challenge.title === challengeToRemove.title
		)
	)

}

export function claimZone(
	{ G, log, playerID }: { G: GameState; log: LogAPI; playerID: string; },
	zoneID: number,
	challenge: Challenge
) {
	const claimedZone = G.zoneData[zoneID];
	console.log("claiming zone", challenge);
	//regular claim
	if (!challenge.hard && claimedZone.controlTeam === null) {
		console.log("regular claim");
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		addLogMetadata({ log }, { zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title });
		return {old: null, new: G.allPlayersData[playerID].teamColor}
	}


	//hard claim to lock
	else if (challenge.hard && claimedZone.controlTeam === null) {
		console.log("locking claim");
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		claimedZone.locked = true;
		addLogMetadata({ log }, { zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title, claimType: "lock" });
		return {old: null, new: G.allPlayersData[playerID].teamColor}
	}


	//steal
	else if (challenge.hard && claimedZone.controlTeam !== null) {
		console.log("stealing claim");
		const oldTeam = claimedZone.controlTeam;
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		claimedZone.locked = true;
		addLogMetadata({ log }, { zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title, claimType: "steal", stealFrom: oldTeam });
		return {old: oldTeam, new: G.allPlayersData[playerID].teamColor}
	}

	//illegal claim
	else if (!challenge.hard && claimedZone.controlTeam !== null) {
		console.log("invalid claim");
		return "INVALID_MOVE";
	}
	return "INVALID_MOVE";
}

export function completeChallenge(
	{ G, log, playerID }: { G: GameState; log: LogAPI; playerID: string; },
	challenge: string,
	evidence: string[]
) {
	discardChallenge({ G, log, playerID }, challenge);
	addLogMetadata(
		{ log },
		{
			challenge,
			evidence,
			team: G.allPlayersData[playerID].teamColor,
		}
	);
}

