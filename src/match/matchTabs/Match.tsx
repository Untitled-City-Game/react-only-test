import useWindowDimensions from "@/scripts/useWindowDimensions";
import ChallengesTab from "@/src/match/matchTabs/ChallengesTab";
import LogTab from "@/src/match/matchTabs/LogTab";
import MapTab from "@/src/match/matchTabs/MapTab";
import { Group, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TbCards, TbMap, TbMessageChatbot } from "react-icons/tb";

export default function Match() {
	const { height, width } = useWindowDimensions();
	console.log("rendering match");
	return (
			<Tabs defaultValue={"map"} variant="pills" radius={0} style={MatchContainerStyles} h={`min(100vh, ${height}px)`} id="matchContainer">
				<TabsPanel value="challenges" style={panelLayout} h={height}>
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
				style={TabListStyles}
					p="0"
					bg="white"
					grow={true}>
					<TabsTab value="challenges" flex="1"><Group gap="0.2rem" fz="md" wrap="nowrap"><TbCards size="1rem"/><span>Challenges</span></Group></TabsTab>
					<TabsTab value="map" flex="1"><Group gap="0.2rem" fz="lg" ><TbMap size="1rem"/> Map</Group></TabsTab>
					<TabsTab value="log" flex="1"><Group gap="0.2rem" fz="lg"><TbMessageChatbot size="1rem"/> Log</Group></TabsTab>
				</TabsList>
			</Tabs>
	);
}

//This contains the tabpanel and the tablist
const MatchContainerStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	overflow: "clip",
};

//this contains the header and tab contents
export const panelLayout: React.CSSProperties = {
	display: "flex",
	minHeight: "0",
	flexDirection: "column",
	alignItems: "stretch",
	flexGrow: 10,
	overflowY: "scroll"
}

const TabListStyles: React.CSSProperties = {
	height: "3em",
	flexShrink: 0,
}