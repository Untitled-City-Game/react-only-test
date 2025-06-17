import useWindowDimensions from "@/scripts/useWindowDimensions";
import { Container, Stack } from "@mantine/core";
import React from "react";

export default function FullHeightLayout({
	children,
	...rest
}: {
	children: React.ReactNode;
}) {
	const { height } = useWindowDimensions();
	return (
		<div
			style={{
				height: height,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				overflow: "scroll",
			}}>
			{children}
		</div>
	);
}

export function VerticalSpread({
	children,
	...rest
}: {
	children: React.ReactNode;
}) {
	return (
		<Container style={FullHeight} {...rest} display="flex" mb="md">
			<Stack
				ta="center"
				style={FullHeight}
				mih="100%"
				justify="space-between">
				{children}
			</Stack>
		</Container>
	);
}
const FullHeight: React.CSSProperties = {
	flexGrow: 100,
};

export const scrollParent : React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	minHeight: "0",
	flexShrink: "100"
}

export const scrollSacrifice : React.CSSProperties = {
	overflow: "scroll",
	flexShrink: "100",
	flexGrow: "100"
}