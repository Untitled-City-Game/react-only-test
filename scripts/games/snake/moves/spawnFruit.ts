import { config } from "@/scripts/games/snake/config";
import { Fruit, SnakeGameState } from "@/scripts/games/snake/types";
import { MoveContext } from "@/scripts/types/types";
import { MapAreaSelectorValue } from "@/src/lobby/CreateMatch/MapAreaSelector";
import { destination, point } from "@turf/turf";
import { Point, Position } from "geojson";

export function updateFruit(context: MoveContext<SnakeGameState>){
	const fruits = context.G.fruits
	const mapArea = context.G.mapArea
	spawnFruit(fruits, mapArea)
}

export function spawnFruit(fruits: Fruit[], mapArea: MapAreaSelectorValue){
		while(fruits.length < config.numberOfFruits){
		//get a random location within the game area
		const randomLocation = randomPointInCircle([mapArea.gameLocation.lng, mapArea.gameLocation.lat], mapArea.gameRadius);
		fruits.push({
			coords: {
				lat: randomLocation.geometry.coordinates[1],
				lng: randomLocation.geometry.coordinates[0],
			},
			challenge: {
				title: "challenge",
				description: "",
				emoji: ""
			}
		})
	}
	return fruits

}

function randomPointInCircle(center : Position, radius: number) {
  // random angle in radians
  const angle = Math.random() * 2 * Math.PI
  
  // random distance with sqrt for uniform distribution
  const distance = Math.sqrt(Math.random()) * radius
  
  // convert polar to geographic coordinates
  return destination(point(center), distance, angle * 180 / Math.PI, { units: 'meters' })
}
