import { createChallengeDeck } from "@/scripts/games/shared_moves/handManagement";
import { AllPlayersData, AllTeamsData, GameSetupData, ConnectFourGameState, PolyData, ZoneData } from "@/scripts/types";
import type { Ctx } from "boardgame.io";

function isGameSetupData(data: unknown): string | undefined {
	if (!data) return ('No game setup data provided');
	if (typeof data !== 'object') return ('Game setup data is not an object');
	if (!('city' in data) || typeof data.city !== 'string') return ('Game setup data is missing city');
	if (!('zonePolygons' in data) || !('winningLines' in data) || !data.zonePolygons || !data.zonePolygons) return ('Game setup data is missing map data');
}

export function gameSetup(ctx: Ctx, setupData: GameSetupData): ConnectFourGameState {
	console.log("Setting up game of connect four");
	console.log("players: ", ctx.numPlayers);
	console.log("currentplayer ", ctx.currentPlayer);
	console.log("city", setupData.mapSetupData.city);
	console.log("getting map data");

	return {
		gameName: setupData.gameName,
		zoneData: createBoardFromMapJson(setupData.mapSetupData.zonePolygons),
		MatchMapData: setupData.mapSetupData,
		active: false,
		gameOver: false,
		allPlayersData: {} as AllPlayersData,
		//declare allteamsdata as AllTeamsData object
		allTeamsData: {} as AllTeamsData,
		challengeDeck: createChallengeDeck(setupData.mapSetupData.city),
		gameStateLogs: [],
	};
}

export function createBoardFromMapJson(mapData: PolyData[]): ZoneData[] {
	return mapData.map((zone, index) => {
		return {
			id: index,
			status: "empty",
			name: zone.featureName,
			controlTeam: null,
			locked: false
		};
	});
}

