import { Center, Stack } from "@mantine/core";
import { Outlet } from "react-router";

export default function LobbyLayout() {
	console.log("rendering lobby layout")
	return (
		<Center>
			<Stack>
				<Outlet />
			</Stack>
		</Center>
		);
		}
		