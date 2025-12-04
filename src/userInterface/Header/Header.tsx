import { defaultColor, theme } from "@/src/styles/theme";
import { Center, CenterProps, MantineColorShade, useMantineTheme } from "@mantine/core";
import React from "react";

export default function Header({ children, color }: { children: React.ReactNode, color: string }) {
	return (
		<ComplexHeader color={color}>
			<h1>{children}</h1>
		</ComplexHeader>
	);
}

export function ComplexHeader({ children, color, ...rest }: { children: React.ReactNode, color?: string} & CenterProps) {
	const theme = useMantineTheme();
	return (
		<Center 
		className="header"
		style={{
			background: color === "rainbow" ? rainbowBackground : defaultColor({shade: 1}),
			borderBottom: color === "rainbow" ? "none" : `2px solid ${defaultColor()}`,
			//borderTop: color === "rainbow" ? "none" : `2px solid ${defaultColor({shade: 3})}`,
			textShadow: "white 1px 0 3px"
		}}
		{...rest}
		>
			{children}
		</Center>
	);
}

const rainbowWidth = 20;
const rainbowColors = [
	theme.colors["red"][3],
	theme.colors["yellow"][6],
	theme.colors["green"][6],
	theme.colors["water"][3],
	theme.colors["purple"][3]
]
const rainbowBackground = `repeating-linear-gradient(100deg, ${rainbowColors.map((color, index) => `${color} ${index*rainbowWidth}px, ${color} ${index*rainbowWidth + rainbowWidth}px`).join(",")})`