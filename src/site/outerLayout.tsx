import Header from "@/src/userInterface/Header";
import { theme } from "@/styles/theme";
import { Center, Container, MantineProvider } from "@mantine/core";
import { Outlet } from "react-router";

export default function OuterLayout() {
	return (
		<MantineProvider theme={theme}>
			<Header color="white">Outside: The Game</Header>
			<Container>
				<Center>
					<Outlet />
				</Center>
			</Container>
		</MantineProvider>
	);
}
