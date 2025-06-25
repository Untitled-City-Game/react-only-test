import { GameState, PlayerData } from "@/scripts/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import { addLogMetadata } from "./metadata";

export function playerSetup(
	{ G, playerID, log }: { G: GameState; playerID: string; log: LogAPI; },
	newPlayerData: PlayerData
) {
	G.allPlayersData[playerID] = newPlayerData;
	
	//check if team color is already set up
	G.allTeamsData[newPlayerData.teamColor];
	if (!G.allTeamsData[newPlayerData.teamColor]) {
		console.log("adding missing team data for", newPlayerData.teamColor);
		G.allTeamsData[newPlayerData.teamColor] = {
			challengeDeck: [],
			challengeHand: [],
			challengeDiscard: [],
		};
	}
	console.log(
		"added player data for",
		playerID,
		newPlayerData,
		newPlayerData.name,
		newPlayerData.teamColor
	);
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);

}
