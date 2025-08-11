import { MoveContext } from "@/scripts/games/connect_four/connect_four";
import { drawToFull } from "@/scripts/games/shared_moves/handManagement";
import { MatchTeamColor } from "@/scripts/types";

export function teamSetup(context: MoveContext) {
	const { G, random } = context;
	console.log("setting up teams", G.allTeamsData);
	//extract team colors from players
	for (const [teamColor, team] of Object.entries(G.allTeamsData)) {
		console.log("setting up team ", teamColor);
		const shuffledDeck = random.Shuffle(G.challengeDeck);
		team.challengeDeck = shuffledDeck;
		team.challengeHand = [];
		team.challengeDiscard = [];
		drawToFull(context, teamColor as MatchTeamColor);
	}
}
