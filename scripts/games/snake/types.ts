import { City, coordSet, GameStateUniversal, PlayerData } from "@/scripts/types";

export interface SnakeGameState extends GameStateUniversal {
	fruits: Fruit[];
	allTeamsData: SnakeTeam[]
	mapArea: {
		center: coordSet,
		radius: number,
	}
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
	startingLocation: coordSet,
	gameRadius : number,
	gameName: string
}