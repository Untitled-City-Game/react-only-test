import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { MatchTeamColor, MoveContext } from "@/scripts/types/types";

export function checkVictory(
	context: MoveContext<ConnectFourGameState>
) {
	const {winningLines} = context.G.MatchMapData;
	const zoneData = context.G.zoneData;
	const teams = context.G.allTeamsData
	console.log("Checking victory condition")
	//build zone lookup by name for O(1) access
	const zoneByName = new Map(zoneData.map(zone => [zone.name, zone]));
	//iterate over winning lines and check relevant polygons
	for (const line of winningLines){
		const controls = line.matchedPolygons.map(name => zoneByName.get(name)?.controlTeam ?? null);
		//check if all zones in line are controlled by the same team
		if (controls.length > 0 && controls[0] !== null && controls.every(c => c === controls[0])){
			context.G.victory = controls[0] as MatchTeamColor;
			console.log("Victory has occured", controls[0]);
			return;
		}
	}
}