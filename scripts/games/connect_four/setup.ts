import { ConnectFourGameState, ZoneData } from "@/scripts/games/connect_four/types";
import { createChallengeDeck } from "@/scripts/games/challenge_deck/handManagement";
import { PolyData } from "@/scripts/types/googleMaps";
import { AllPlayersData, GameSetupData, MoveContext, PlayerData } from "@/scripts/types/types";
import type { Ctx } from "boardgame.io";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";
import { challengeDeckPlayerSetup } from "@/scripts/games/challenge_deck/challenge_deck_player_setup";

function isGameSetupData(data: unknown): string | undefined {
	if (!data) return ('No game setup data provided');
	if (typeof data !== 'object') return ('Game setup data is not an object');
	if (!('city' in data) || typeof data.city !== 'string') return ('Game setup data is missing city');
	if (!('zonePolygons' in data) || !('winningLines' in data) || !data.zonePolygons || !data.zonePolygons) return ('Game setup data is missing map data');
}

export function ConnectFourGameSetup(ctx: Ctx, setupData: GameSetupData): ConnectFourGameState {
	console.log("Setting up game of connect four");
	console.log("setup data", setupData)
	console.log("players: ", ctx.numPlayers);
	console.log("currentplayer ", ctx.currentPlayer);
	console.log("city", setupData.mapSetupData.city);

	return {
		gameCode: "connect_four",
		gameName: setupData.gameName,
		zoneData: createBoardFromMapJson(setupData.mapSetupData.zonePolygons),
		MatchMapData: setupData.mapSetupData,
		active: false,
		gameOver: false,
		allPlayersData: {} as AllPlayersData,
		allTeamsData : {},
		challengeDeck: createChallengeDeck(setupData.mapSetupData.city),
		allTeamsChallengeData: {},
		gameStateLogs: [],
		city: setupData.mapSetupData.city,
		teamPhotoURLs: {},
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

export function connectFourPlayerSetup(context: MoveContext<ConnectFourGameState>, newPlayerData: PlayerData){
	playerSetup(context, newPlayerData)
	challengeDeckPlayerSetup(context, newPlayerData)
}

export function setStartingZone(context: MoveContext<ConnectFourGameState>, startingZone: string){
	context.G.startingZone = startingZone
}