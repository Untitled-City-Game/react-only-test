import { City, CoordSet, GameStateLog, GameStateUniversal, PlayerData } from "@/scripts/types/types";

export interface SnakeGameState extends GameStateUniversal {
	gameCode: "snake"
	fruits: Fruit[];
	snakeTeamData: Record<string, SnakeTeam>
	mapArea: {
		center: CoordSet,
		radius: number,
	}
	gameStateLogs: GameStateLog<SnakeGameState>[],
}

export type Fruit = {
	coords: {lat: number, long: number} 
	challenge: SnakeChallenge
}

export type SnakeChallenge = {
	title: string,
	description: string,
	emoji: string,
}
export type SnakeTeam = {
	color: string,
	name: string,
	players: PlayerData[]
	snakeBody: SnakeBody
}

export type SnakeBody = {
	maxLength: number
	timeHorizon: number
	segments: SnakeSegment[]
}

export type SnakeSegment = {
	coords: {lat: number, long: number}
}

export type SnakeGameSetupData = {
	startingLocation: CoordSet,
	gameRadius : number,
	gameName: string
}