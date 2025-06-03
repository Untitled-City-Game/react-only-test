import { theme } from "@/src/styles/theme";
import { Center } from "@mantine/core";

export default function Header({ children, color }: { children: React.ReactNode, color: string }) {
	return (
		<ComplexHeader color={color}>
			<h1>{children}</h1>
		</ComplexHeader>
	);
}

export function ComplexHeader({ children, color }: { children: React.ReactNode, color: string }) {
	return (
		<Center 
		className="header"
		bg={`${color}.1`} 
		p="0"
		mb="md"
		style={{
			borderBottom: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`,
			borderTop: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`,
		}}>
			{children}
		</Center>
	);
}