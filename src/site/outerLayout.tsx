import { theme } from "@/src/styles/theme";
import Header from "@/src/userInterface/Header/Header";
import { Center, Container, MantineProvider } from "@mantine/core";
import { Outlet } from "react-router";

export default function OuterLayout() {
	return (
		<MantineProvider theme={theme}>
			<Header color="rainbow">Outside: The Game</Header>
			<Container>
				<Center>
					<Outlet />
				</Center>
			</Container>
		</MantineProvider>
	);
}
