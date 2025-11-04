import { ChallengeDeck } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { GameStateUniversal, MatchMapData, GameStateLog, Color, zoneStatus, City } from "@/scripts/types/types";

//Game state


export interface ConnectFourGameState extends GameStateUniversal, ChallengeDeck {
	gameCode: "connect_four",
	city: City,
	zoneData: ZoneData[],
	MatchMapData: MatchMapData,
	active: boolean,
	gameStateLogs: GameStateLog<ConnectFourGameState>[],
	startingZone?: string
}

export type ZoneData = {
	id: number;
	status: zoneStatus;
	name: string;
	controlTeam: Color | null;
	locked: boolean;
}
