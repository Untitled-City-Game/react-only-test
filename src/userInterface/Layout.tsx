import useWindowDimensions from "@/scripts/useWindowDimensions";
import { Container, Stack } from "@mantine/core";
import React from "react";

export default function FullHeightLayout({ children, ...rest }: { children: React.ReactNode }) {
	const { height } = useWindowDimensions();
	return (
		<>
			<div style={{
			height: height,
			width: "100%",
			// backgroundColor: "rgba(255, 0, 255, 0.5)",
			// border: "5px solid red",
			overflow: "scroll"
		}}>
			<Stack mih="100%">
			{children}
			</Stack>
		</div>
			</>
	);
}

export function VerticalSpread({ children, ...rest }: { children: React.ReactNode }) {
	return (
		<Container style={FullHeight} {...rest} display="flex" mb="md">
			<Stack ta="center" style={FullHeight} mih="100%" justify="space-between">
				{children}
			</Stack>
		</Container>
	);
}
const FullHeight : React.CSSProperties = {
	flexGrow: 100,
}