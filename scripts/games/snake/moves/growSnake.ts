import { config } from "@/scripts/games/snake/config";
import { SnakeGameState } from "@/scripts/games/snake/types";
import { MoveContext } from "@/scripts/types/types";

export default function growSnake(	context: MoveContext<SnakeGameState>, amt : number){
	const { G, log, playerID } = context;
	const team = G.allPlayersData[playerID].teamColor
	G.snakeTeamData[team].snakeBody.maxLength += amt*config.lengthFactor;
	G.snakeTeamData[team].snakeBody.timeHorizon += amt*config.timeFactor
}