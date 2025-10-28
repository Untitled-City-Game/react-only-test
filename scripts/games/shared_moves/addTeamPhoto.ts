import { GameStateUniversal, MatchTeamString, MoveContext } from "@/scripts/types/types";

export function addTeamPhoto<GameState extends GameStateUniversal>(context: MoveContext<GameState>, photoUrl: string, team: MatchTeamString) {
	console.log("adding team photo url")
	context.G.teamPhotoURLs[team] = photoUrl
}
