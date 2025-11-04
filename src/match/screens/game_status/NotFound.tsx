import { Center, Stack, Button } from "@mantine/core";
import { Link } from "react-router";

export default function NotFound() {
	return (
		<Center>
			<Stack>
				<h1>Page not found</h1>
				<p>We're not sure what's meant to be here.</p>
				<Button component={Link} to="/lobby">Back to lobby</Button>
				<Button component={Link} to="/match">Back to game</Button>
			</Stack>
		</Center>
	);
}