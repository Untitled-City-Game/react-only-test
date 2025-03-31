import ChallengesTab from "@/src/match/matchTabs/ChallengesTab";
import LogTab from "@/src/match/matchTabs/LogTab";
import MapTab from "@/src/match/matchTabs/MapTab";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Match() {
	console.log("rendering match");
	return (
			<Tabs defaultValue={"map"} variant="pills" radius={0} style={MatchContainerStyles} id="matchContainer">
				<TabsPanel value="challenges" style={panelLayout}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<ChallengesTab />
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="map" className="mapPanel" style={panelLayout}>
					<ErrorBoundary fallback={<div>Something went wrong.</div>}>
						<Suspense
							fallback={
								<span>Loading mapboard in match.tsx.</span>
							}>
							<MapTab />
						</Suspense>
					</ErrorBoundary>
				</TabsPanel>
				<TabsPanel value="log" style={panelLayout}>
					<ErrorBoundary
						fallback={<span>Something went wrong.</span>}>
						<LogTab />
					</ErrorBoundary>
				</TabsPanel>
				<TabsList
					p="0"
					h="3em"
					w="100%"
					bg="white"
					grow={true}>
					<TabsTab value="challenges">Challenges</TabsTab>
					<TabsTab value="map">Map</TabsTab>
					<TabsTab value="log">Log</TabsTab>
				</TabsList>
			</Tabs>
	);
}

//This contains the tabpanel and the tablist
const MatchContainerStyles: React.CSSProperties = {
	height: "100vh",
	width: "100vw",
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	overflow: "clip"
};

//this contains the header and tab contents
const panelLayout: React.CSSProperties = {
	display: "flex",
	minHeight: "0",
	flexDirection: "column",
	alignItems: "stretch",
	flexGrow: 10,
	overflow: "scroll"
}