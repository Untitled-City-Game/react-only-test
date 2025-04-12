import { LobbyClient } from 'boardgame.io/dist/types/packages/client';
import { MatchTeamColor, NamedColor, PlayerData } from './types';

export async function joinMatch(
	lobbyClient: LobbyClient, 
	matchID: string, 
	PlayerName: string,
	teamID: NamedColor
 	) {
	const res = await lobbyClient.joinMatch(
		'connect-four',
		matchID,
		{
			playerName: PlayerName,
			data: {
				teamColor: teamID
			}
		}
	);

	//set player data
	const playerData: PlayerData = {
		name: PlayerName,
		playerID: res.playerID as `${number}`,
		matchID: matchID,
		playerCredentials: res.playerCredentials,
		teamColor: teamID as MatchTeamColor,
	};
	return playerData;
}
