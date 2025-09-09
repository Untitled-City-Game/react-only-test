import { calculateSnakeLength } from "@/scripts/games/snake/moves/manageSnakeBody"
import { GameContext, SnakeContext } from "@/src/match/Board"
import { useContext } from "react"

export default function SnakeData(){
	const snakeGameState = useContext(SnakeContext)
	const gameContext = useContext(GameContext)
	const teamColor = gameContext.playerData.data.teamColor
	const teamData = snakeGameState.snakeTeamData[teamColor]
	return (
	<>
		<p>Snake Max Length: {teamData.snakeBody.maxLength} meters</p>
		<p>Snake Current Length: {Math.round(calculateSnakeLength(teamData.snakeBody.segments))} meters</p>
		<p>Snake body timeout: {teamData.snakeBody.timeHorizon} minutes</p>
	</>)
}