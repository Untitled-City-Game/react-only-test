import { Center, Stack } from "@mantine/core";
import { Outlet } from "react-router";

export default function LobbyLayout() {
	return (
		<Center>
			<Stack>
				<Outlet />
			</Stack>
		</Center>
		);
		}
		