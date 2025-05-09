import { games } from "@/scripts/consts";
import Header from "@/src/userInterface/Header";
import { theme } from "@/styles/theme";
import { RiArrowLeftBoxLine } from "react-icons/ri";

import {
	ActionIcon,
	Container,
	MantineProvider,
	mergeMantineTheme,
	Stack,
} from "@mantine/core";
import { Outlet, useNavigate, useParams } from "react-router";

export default function LobbyLayout() {
	const navigate = useNavigate();
	const gameCode = useParams().gameCode;
	const game = games.find((game) => game.code === gameCode);
	const lobbyTheme = mergeMantineTheme(theme, {
		primaryColor: game?.color || "grey",
		primaryShade: 6,
	});
	console.timeLog("load", "lobby layout");
	return (
		<MantineProvider theme={lobbyTheme}>
			<Stack w="100%" mih="100%" gap={0}>
				<Header color={game?.color || "white"}>
					{game?.name} Lobby
				</Header>
				<Container maw="500px" w="100%" style={{flexGrow: 10}}  mb="md" pl="md" pr="md">
					<Stack w="100%" gap={0}>
					<Outlet />
					</Stack>
				</Container>
				<Container w="100%" mb="md" pl="md" pr="md">
					<ActionIcon
						size="lg"
						aria-label="Back"
						variant="filled"
						autoContrast
						onClick={() => navigate(-1)}>
						<RiArrowLeftBoxLine size={100} />
					</ActionIcon>
				</Container>
			</Stack>
		</MantineProvider>
	);
}
