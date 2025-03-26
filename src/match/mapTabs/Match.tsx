import Challenges from "@/src/match/gameTabs/Challenges";
import GameLog from "@/src/match/gameTabs/GameLog";
import MapBoard from "@/src/match/gameTabs/mapAsBoardgame";
import { Container, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Home() {
	console.log("rendering match");
	return (
		<Container mih="100vh" h={0} px={0}>
			<Tabs defaultValue={"map"} h="100%" variant="pills" radius="xs">
				<TabsPanel value="challenges" style={panelStyles}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<Challenges />
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="map" className="mapPanel" style={panelStyles}>
					<ErrorBoundary fallback={<div>Something went wrong.</div>}>
						<Suspense
							fallback={
								<span>Loading mapboard in match.tsx.</span>
							}>
							<MapBoard />
						</Suspense>
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="log" style={panelStyles}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<GameLog />
					</ErrorBoundary>
				</TabsPanel>
				<TabsList
					pos="fixed"
					bottom={0}
					left={0}
					h={tabHeight}
					w="100%"
					bg="white"
					grow={true}>
					<TabsTab value="challenges">Challenges</TabsTab>
					<TabsTab value="map">Map</TabsTab>
					<TabsTab value="log">Log</TabsTab>
				</TabsList>
			</Tabs>
		</Container>
	);
}

const tabHeight = "3rem";

const panelStyles: React.CSSProperties = {
	paddingBottom: tabHeight,
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	minHeight: "100%",
	flexGrow: 10,
};
