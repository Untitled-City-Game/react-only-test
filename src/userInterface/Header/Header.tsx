import { theme } from "@/src/styles/theme";
import { Center, CenterProps } from "@mantine/core";
import React from "react";

export default function Header({ children, color }: { children: React.ReactNode, color: string }) {
	return (
		<ComplexHeader color={color}>
			<h1>{children}</h1>
		</ComplexHeader>
	);
}

export function ComplexHeader({ children, color, ...rest }: { children: React.ReactNode, color: string} & CenterProps) {
	return (
		<Center 
		className="header"
		bg={`${color}.1`} 
		style={{
			borderBottom: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`,
			borderTop: `2px solid ${theme.colors[color]?.[6] || theme.colors.gray[6]}`,
		}}
		{...rest}
		>
			{children}
		</Center>
	);
}