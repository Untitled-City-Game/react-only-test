import { addLogMetadata } from "@/scripts/games/shared_moves/metadata";
import { config } from "@/scripts/games/snake/config";
import growSnake from "@/scripts/games/snake/moves/growSnake";
import { trimSnake } from "@/scripts/games/snake/moves/manageSnakeBody";
import { updateFruit } from "@/scripts/games/snake/moves/spawnFruit";
import { Fruit, SnakeGameState } from "@/scripts/games/snake/types";
import { MoveContext } from "@/scripts/types/types";

function eatFruit(context: MoveContext<SnakeGameState>, eatenFruit: Fruit) {
	
	//remove eaten fruit
	context.G.fruits = context.G.fruits.filter(fruit => {
		fruit.challenge.title !== eatenFruit.challenge.title
	})

	growSnake(context, config.standardFruitGrowth)
	updateFruit(context)
	trimSnake(context)
}

export function completeChallengeAndEatFruit(context: MoveContext<SnakeGameState>, eatenFruit: Fruit, evidence: string[]){
	const { G, log, playerID } = context;
	const challenge = eatenFruit.challenge
	eatFruit(context, eatenFruit)
	addLogMetadata(
		{ log },
		{
			team: G.allPlayersData[playerID].teamColor,
			challenge: challenge.title,
			growth: config.standardFruitGrowth,
			evidence,
		}
	);
	
}