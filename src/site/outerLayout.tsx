import { theme } from "@/src/styles/theme";
import Header from "@/src/userInterface/Header/Header";
import { Center, Container, MantineProvider, Text } from "@mantine/core";
import { Outlet } from "react-router";
import packageJson from "@/package.json";

export default function OuterLayout() {
	return (
		<MantineProvider theme={theme}>
			{/* <Header color="rainbow">Playground City</Header> */}
			<Center>
			<img src="logo.png" style={{
				width: "80%",
				maxWidth: "30rem",
				paddingTop: "1rem"
			}} />
			</Center>
			<Container>
				<Center>
					<Outlet />
				</Center>
			</Container>
			<Center mt="xl" mb="md">
				<Text size="xs" c="dimmed">v{packageJson.version}</Text>
			</Center>
		</MantineProvider>
	);
}
