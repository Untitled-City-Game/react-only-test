import ChallengesTab from "@/src/match/matchTabs/ChallengesTab";
import LogTab from "@/src/match/matchTabs/LogTab";
import MapTab from "@/src/match/matchTabs/MapTab";
import { Container, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Match() {
	console.log("rendering match");
	return (
		<Container mih="100vh" h={0} px={0}>
			<Tabs defaultValue={"map"} h="100%" variant="pills" radius="xs">
				<TabsPanel value="challenges" style={panelStyles}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<ChallengesTab />
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="map" className="mapPanel" style={panelStyles}>
					<ErrorBoundary fallback={<div>Something went wrong.</div>}>
						<Suspense
							fallback={
								<span>Loading mapboard in match.tsx.</span>
							}>
							<MapTab />
						</Suspense>
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="log" style={panelStyles}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<LogTab />
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
