import { PlayerData } from "@/scripts/types/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import { SnakeGameState } from "@/scripts/games/snake/types";
import { addLogMetadata } from "@/scripts/games/shared_moves/metadata";

//TODO: Turn this into a snake team setup
export function snakePlayerSetup(
	{ G, playerID, log }: { G: SnakeGameState; playerID: string; log: LogAPI; },
	newPlayerData: PlayerData
) {
	console.log("setting up player");
	G.allPlayersData[playerID] = newPlayerData;
	
	//check if team color is already set up
	G.allTeamsData[newPlayerData.teamColor];
	if (!G.allTeamsData[newPlayerData.teamColor]) {
		console.log("adding missing team data for", newPlayerData.teamColor);
		G.allTeamsData[newPlayerData.teamColor] = {
			color: newPlayerData.teamColor,
			name: "",
			players: [newPlayerData],
			snakeBody: {
				maxLength: 0,
				timeHorizon: 0,
				segments: []
			}
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
