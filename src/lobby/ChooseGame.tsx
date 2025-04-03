//Set of button links to choose game from list in consts.ts. Inactive games are marked "coming soon". Choosing a game will redirect to the choose match page.
import { games } from "@/scripts/consts";
import { Button, ListItem } from "@mantine/core";
import { Link } from "react-router";
export default function ChooseGame() {
	const gameListItems = games.map((game, index) => {
		return (
			<ListItem key={index}>
				<Button component={Link} to="/choose-match" disabled={!game.active}>{game.name}</Button>
			</ListItem>
		);
	});
	return (
		{gameListItems}
	)
}