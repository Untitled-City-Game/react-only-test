import { MoveContext, PlayerData } from "@/scripts/types/types";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import { SnakeGameState, SnakeTeam } from "@/scripts/games/snake/types";
import { addLogMetadata } from "@/scripts/games/shared_moves/metadata";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";

//TODO: Turn this into a snake team setup
export function snakePlayerSetup(
	context: MoveContext<SnakeGameState>,
	newPlayerData: PlayerData
) {
	console.log("setting up player");
	playerSetup(context, newPlayerData)
	if(!context.G.snakeTeamData[newPlayerData.teamColor]){
			context.G.snakeTeamData[newPlayerData.teamColor] = newSnakeTeamData(newPlayerData)
		}
}

function newSnakeTeamData(playerData : PlayerData) : SnakeTeam {
	console.log("new snake team data created", playerData)
	return {
		color: playerData.teamColor,
		name: playerData.teamColor,
		players: [playerData],
		snakeBody: {
			maxLength: 100,
			timeHorizon: 10,
			segments: []
		}
	}
}