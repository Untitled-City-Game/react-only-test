import {spawnFruit} from "@/scripts/games/snake/moves/spawnFruit";
import { SnakeGameSetupData, SnakeGameState } from "@/scripts/games/snake/types";
import { Ctx } from "boardgame.io";

export function snakeGameSetup(ctx: Ctx, setupData: SnakeGameSetupData): SnakeGameState {
	console.log("Setting up game of snake", setupData);
	const gameData : SnakeGameState = {
		gameName: setupData.gameName,
		gameCode: 'snake',
		fruits: spawnFruit([], setupData.mapArea),
		allTeamsData: {},
		snakeTeamData: {},
		allPlayersData: {},
		gameOver: false,
		gameStateLogs: [],
		active: false,
		mapArea: setupData.mapArea,
		teamPhotoURLs: {},
	}
	console.log(gameData)
	return gameData;
}