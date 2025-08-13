import { SnakeGameSetupData, SnakeGameState } from "@/scripts/games/snake/types";
import { Ctx } from "boardgame.io";

export function snakeGameSetup(ctx: Ctx, setupData: SnakeGameSetupData): SnakeGameState {
	console.log("Setting up game of snake");
	const gameData : SnakeGameState = {
		gameName: setupData.gameName,
		gameCode: 'snake',
		fruits: [],
		allTeamsData: {},
		snakeTeamData: {},
		allPlayersData: {},
		gameOver: false,
		gameStateLogs: [],
		active: false,
		mapArea: {
			center: setupData.startingLocation,
			radius: setupData.gameRadius
		}
	}
	return gameData;
}