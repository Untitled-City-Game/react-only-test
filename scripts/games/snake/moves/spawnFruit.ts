import { config } from "@/scripts/games/snake/config";
import { Fruit, SnakeGameState } from "@/scripts/games/snake/types";
import { MapAreaSelectorValue } from "@/scripts/types/googleMaps";
import { MoveContext } from "@/scripts/types/types";
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
		const variantNum = Math.random()*3
		console.log("variant num", variantNum)
		const variant = variantNum < 1 ? "there" : variantNum < 2 ? "bring" : "go_come_back"
		console.log("variant", variant)
		fruits.push({
			coords: {
				lat: randomLocation.geometry.coordinates[1],
				lng: randomLocation.geometry.coordinates[0],
			},
			challenge: {
				title: "challenge_" + Math.random(),
				description: "",
				emoji: "",
				variant: variant
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
