//Set of button links to choose game from list in consts.ts. Inactive games are marked "coming soon". Choosing a game will redirect to the choose match page.
import { games } from "@/scripts/consts";
import { ListButton } from "@/src/userInterface/ListButton";
import { Container, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

export default function ChooseGame() {
	const gameListItems = games.map((game, index) => {
		return (
			<ListButton
				key={index}
				component={game.active ? Link : undefined}
				to={`/lobby/${game.code}/choose-match`}
				color={game.active ? game.color : "gray"}
				>
				<game.icon color={game.active ? `var(--mantine-color-${game.color}-7` : "gray"} size={60} />
				<Container p="0">
					<h3>{game.name}</h3>
					<Text fs="italic">{game.active ? "" : "Coming soon"}</Text>
					<Text fz="sm">{game.description}</Text>
				</Container>
			</ListButton>
		);
	});
	return (
		<Container>
			<Stack>
				<h2>Choose a game</h2>
				{gameListItems}
			</Stack>
		</Container>
	);
}
