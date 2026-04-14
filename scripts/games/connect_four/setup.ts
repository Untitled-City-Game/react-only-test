import { ConnectFourGameSetupData, ConnectFourGameState, ZoneData } from "@/scripts/games/connect_four/types";
import { createChallengeDeck } from "@/scripts/games/challenge_deck/handManagement";
import { PolyData } from "@/scripts/types/googleMaps";
import { AllPlayersData, GameSetupDataGeneric, MoveContext, PlayerData } from "@/scripts/types/types";
import type { Ctx } from "boardgame.io";
import { playerSetup } from "@/scripts/games/shared_moves/playerSetup";
import { challengeDeckPlayerSetup } from "@/scripts/games/challenge_deck/challenge_deck_player_setup";

export function ConnectFourGameSetup(ctx: Ctx, setupData: ConnectFourGameSetupData): ConnectFourGameState {
	console.log("Setting up game of connect four");
	console.log("setup data", setupData)
	console.log("players: ", ctx.numPlayers);
	console.log("currentplayer ", ctx.currentPlayer);
	console.log("city", setupData.mapSetupData.city);
	console.log("getting map data");

	return {
		gameCode: "connect_four",
		gameName: setupData.gameName,
		zoneData: createBoardFromMapJson(setupData.mapSetupData.zonePolygons),
		MatchMapData: setupData.mapSetupData,
		active: false,
		gameOver: false,
		allPlayersData: {} as AllPlayersData,
		allTeamsData : {},
		challengeDeck: createChallengeDeck(setupData.mapSetupData.city, setupData.winter, setupData.money),
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