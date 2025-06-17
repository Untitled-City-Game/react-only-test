import { games } from "@/scripts/consts";
import { theme } from "@/src/styles/theme";
import Header from "@/src/userInterface/Header/Header";
import { RiArrowLeftBoxLine } from "react-icons/ri";

import useWindowDimensions from "@/scripts/useWindowDimensions";
import FullHeightLayout, { scrollParent } from "@/src/userInterface/Layout";
import {
	ActionIcon,
	Box,
	Container,
	MantineProvider,
	mergeMantineTheme
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
	const { height } = useWindowDimensions();
	return (
		<MantineProvider theme={lobbyTheme}>
			<FullHeightLayout>
				<Box>
					<Header color={game?.color || "white"}>
						{game?.name} Lobby
					</Header>
				</Box>
				<Container maw="500px" w="100%" style={scrollParent}>
					<Outlet />
				</Container>
				<Container w="100%" pb="md">
					<ActionIcon
						size="lg"
						aria-label="Back"
						variant="filled"
						autoContrast
						onClick={() => navigate(-1)}>
						<RiArrowLeftBoxLine size={100} />
					</ActionIcon>
				</Container>
			</FullHeightLayout>
		</MantineProvider>
	);
}
