import ChallengesTab from "@/src/match/matchTabs/challengeTab/ChallengesTab";
import LogTab from "@/src/match/matchTabs/logTab/LogTab";
import MapTab from "@/src/match/matchTabs/MapTab";
import { Group, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TbCards, TbMap, TbMessageChatbot } from "react-icons/tb";

export default function Match() {
	console.log("rendering match");
	const [activeTab, setActiveTab] = useState<string | null>(null);
	return (
			<Tabs defaultValue={"map"} variant="pills" radius={0} id="matchContainer"  onChange={setActiveTab}>
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
						<LogTab active={activeTab}/>
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

export const tabHeight = "3em"

//This contains the tabpanel and the tablist
const MatchContainerStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
};

//this contains the header and tab contents
export const panelLayout: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	position: "fixed",
	top: "0",
	left: "0",
	right: "0",
	bottom: "0",
	marginBottom: tabHeight,
}

const TabListStyles: React.CSSProperties = {
	height: tabHeight,
	flexShrink: 0,
	position: "fixed",
	bottom: "0",
	left: "0",
	right: "0",
}