import { LobbyClient } from 'boardgame.io/dist/types/packages/client';
import { MatchTeamColor, NamedColor, PlayerData } from './types/types';

export async function joinMatch(
	lobbyClient: LobbyClient,
	gameCode: string,
	matchID: string, 
	PlayerName: string,
	teamID: NamedColor,
	admin: boolean = false
 	) {
	const res = await lobbyClient.joinMatch(
		gameCode,
		matchID,
		{
			playerName: PlayerName,
			data: {
				teamColor: teamID,
				admin
			}
		}
	);

	//set player data
	const playerData: PlayerData = {
		name: PlayerName,
		playerID: res.playerID as `${number}`,
		matchID: matchID,
		gameCode,
		playerCredentials: res.playerCredentials,
		teamColor: teamID as MatchTeamColor,
		admin
	};
	return playerData;
}
