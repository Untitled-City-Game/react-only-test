import { Center, Stack } from "@mantine/core";
import { Outlet } from "react-router";

export default function LobbyLayout() {
	console.timeLog("load", "lobby layout");
	return (
		<Center>
			<Stack>
				<Outlet />
			</Stack>
		</Center>
		);
		}
		