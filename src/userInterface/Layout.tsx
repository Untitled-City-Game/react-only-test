import useWindowDimensions from "@/scripts/useWindowDimensions";
import { Container, Stack } from "@mantine/core";
import React from "react";

export default function FullHeightLayout({ children, ...rest }: { children: React.ReactNode }) {
	const { height } = useWindowDimensions();
	return (
			<Stack w="100%" gap={0} mih={`min(100vh, ${height}px`} {...rest}>
				{children}
			</Stack>
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