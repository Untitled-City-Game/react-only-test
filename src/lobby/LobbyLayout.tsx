import { games } from "@/scripts/consts";
import Header from "@/src/userInterface/Header";
import { theme } from "@/styles/theme";
import {
	Center,
	Container,
	MantineProvider,
	mergeMantineTheme,
	Stack
} from "@mantine/core";
import { Outlet, useParams } from "react-router";

export default function LobbyLayout() {
	const gameCode = useParams().gameCode;
	const game = games.find((game) => game.code === gameCode);
	const lobbyTheme = mergeMantineTheme(theme, {
		primaryColor: game?.color || "grey",
		primaryShade: 6,
	});
	console.timeLog("load", "lobby layout");
	return (
		<MantineProvider theme={lobbyTheme}>
			<Header color={game?.color || "white"}>{game?.name} Lobby</Header>
			<Container pb="md">
			<Center>
				<Stack gap="0" w="100%">

			<Outlet />
			</Stack>
			</Center>
			</Container>
		</MantineProvider>
	);
}
