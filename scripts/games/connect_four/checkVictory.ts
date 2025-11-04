import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { MatchTeamColor, MoveContext } from "@/scripts/types/types";

export function checkVictory(
	context: MoveContext<ConnectFourGameState>
) {
	const {winningLines} = context.G.MatchMapData;
	const zoneData = context.G.zoneData;
	const teams = context.G.allTeamsData
	console.log("Checking victory condition")
	//iterate over winning lines and check relevant polygons
	for (const line of winningLines){
		//get relevant zonedata
		const matchedZoneControl = zoneData.filter(zone => line.matchedPolygons.includes(zone.name)).map(zone => zone.controlTeam)
		//check if all are owned by one team
		for(const team of Object.keys(teams)){
			if(matchedZoneControl.every(control => control === team)){
				context.G.victory = team as MatchTeamColor
				console.log("Victory has occured", team)
				return;
			}
		}
	}
}