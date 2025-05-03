import { theme } from "@/styles/theme";
import { Center } from "@mantine/core";

export default function Header({ children, color }: { children: React.ReactNode, color: string }) {
	return (
		<Center bg={`${color}.1`} p="0" style={{
			borderBottom: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`,
			borderTop: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`
		}}>
			<h1>{children}</h1>
		</Center>
	);
}