import Header from "@/src/userInterface/Header";
import { theme } from "@/styles/theme";
import {
	MantineProvider
} from "@mantine/core";
import { Outlet } from "react-router";

export default function OuterLayout() {
	return (
		<MantineProvider theme={theme}>
			<Header color="white">Outside: The Game</Header>
			<Outlet />
		</MantineProvider>
	);
}
