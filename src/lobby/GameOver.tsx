import { GameContext } from "@/src/match/Board";
import Button from "@/src/userInterface/CustomButton";
import { Center, Container, Stack } from "@mantine/core";
import { useContext } from "react";
import { Link } from "react-router";
export default function GameOver(){
	const props = useContext(GameContext);
	return (
	<Container>
		<Center>
			<Stack>
				<h1>This game has ended</h1>
					<Button component={Link} to="/">Join another game</Button>
			</Stack>
		</Center>
	</Container>
	)
}