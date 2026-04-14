import { AllPlayersData } from "@/scripts/types/types";

export function baseGameState<T extends string>(gameCode: T, gameName: string) {
	return {
		gameCode,
		gameName,
		active: false,
		gameOver: false,
		allPlayersData: {} as AllPlayersData,
		allTeamsData: {},
		gameStateLogs: [],
		teamPhotoURLs: {},
	};
}
