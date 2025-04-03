//Set of button links to choose game from list in consts.ts. Inactive games are marked "coming soon". Choosing a game will redirect to the choose match page.
import { games } from "@/scripts/consts";
import { Card, Center, Stack } from "@mantine/core";
import { Link } from "react-router";
export default function ChooseGame() {
	const gameListItems = games.map((game, index) => {
		return (
			game.active ? 
				<Card 
				key={index} 
				component={Link} 
				to="/lobby/choose-match" 
				shadow="sm"
				padding="xl"
				withBorder
				
						  >
					<h3>{game.name}</h3>
					<p>{game.description}</p>
				</Card>
				: 
				<Card 
				key={index} 
				shadow="sm"
				padding="xl"
				withBorder
						  >
					<h3>{game.name}</h3>
					<p>Coming soon!</p>
				</Card>
		);
	});
	return (
		<Center>
			<Stack>
				<h1>Outside: The Game</h1>
				<h2>Choose a game</h2>
				<Stack>
					{gameListItems}
				</Stack>
			</Stack>
		</Center>
		
	)
}