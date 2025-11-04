import { SnakeBody, SnakeGameState, SnakeSegment } from "@/scripts/games/snake/types";
import { MoveContext } from "@/scripts/types/types";
import * as turf from '@turf/turf'
export function addSegment(	context: MoveContext<SnakeGameState>, position : google.maps.LatLngLiteral){
	const { G, log, playerID } = context;
	const team = G.allPlayersData[playerID].teamColor
	const teamSnakeBody =G.snakeTeamData[team].snakeBody
	teamSnakeBody.segments.push({...position, timecode : Date.now()})
	//trim snake
	trimSnake(context)
}

export function trimSnake(context: MoveContext<SnakeGameState>){
	const teamSnakeBody = context.G.snakeTeamData[context.G.allPlayersData[context.playerID].teamColor].snakeBody
	trimSnakeLength(teamSnakeBody);
	trimSnakeTime(teamSnakeBody);
}

export function calculateSnakeLength(segments: SnakeSegment[]) {
	const arrayPoints = segments.map(point => ([point.lng, point.lat]))
	const distance = turf.length(turf.lineString(arrayPoints), {units : "meters"})
	return distance
}

function trimSnakeLength(snake : SnakeBody){
	if(!snake.segments || snake.segments.length === 1){return snake}
	console.log("trimming snake", calculateSnakeLength(snake.segments), snake.maxLength)
	if(calculateSnakeLength(snake.segments) > snake.maxLength){
		snake.segments.shift()
		return trimSnakeLength(snake);
	} else {
		return snake;
	}
}

function trimSnakeTime(snake: SnakeBody){
	if(!snake.segments || snake.segments.length === 1){return snake}
	if(snake.segments[0].timecode < (Date.now() - snake.timeHorizon*60*1000)){
		snake.segments.shift()
		return trimSnakeTime(snake)
	} else {
		return snake
	}
}

