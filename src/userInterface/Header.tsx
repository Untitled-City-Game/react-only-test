import { theme } from "@/styles/theme";
import { Container, Group } from "@mantine/core";
import Span from "./Span";

export default function Header({ children }: { children: React.ReactNode }) {
	return (
			<Container style={headerStyles} className="header">
				<Group justify="center" align="center">
					<Span size="xs">x neighbourhoods claimed</Span>
					<Span size="xs">time remaining</Span>
				</Group>
				{children}
			</Container>
	);
}

const headerStyles = {
	position: "sticky" as const,
	top: 0,
	backgroundColor: theme.white,
	width: "100%",
	zIndex: 1,
	padding: "1rem",
};