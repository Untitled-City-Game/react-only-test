import {  GameStateGeneric, MoveContext, PlayerData } from "@/scripts/types/types";
import { addLogMetadata } from "../shared_moves/metadata";

export function playerSetup(
	context: MoveContext<GameStateGeneric>,
	newPlayerData: PlayerData
) {
	const {G, playerID, log} = context
	console.log("setting up player", playerID);
	G.allPlayersData[playerID] = newPlayerData;
	
	//check if team color is already set up
	if (!G.allTeamsData[newPlayerData.teamColor]) {
		console.log("adding missing team data for", newPlayerData.teamColor);
		G.allTeamsData[newPlayerData.teamColor] = [newPlayerData.playerID]
	} else {
		G.allTeamsData[newPlayerData.teamColor].push(newPlayerData.playerID)
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

