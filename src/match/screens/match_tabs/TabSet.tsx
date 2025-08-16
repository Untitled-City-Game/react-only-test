import { GameBoardContext, TabData } from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import ConnectFourMapTab from "@/src/match/screens/connect_four/ConnectFourMap";
import ChallengesTab from "@/src/match/screens/match_tabs/challenges/ChallengesTab";
import LogTab from "@/src/match/screens/match_tabs/game_log/LogTab";
import SnakeMap from "@/src/match/screens/snake/SnakeMapTab";
import { Group, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Suspense, useContext, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TbCards, TbMap, TbMessageChatbot } from "react-icons/tb";

const logTabData: TabData = {
	name: "Log",
	component: LogTab,
	icon: TbMessageChatbot
}

const challengeTabData: TabData = {
	name: "Challenges",
	component: ChallengesTab,
	icon: TbCards
}

const connectFourMapData : TabData = {
				name: "Map",
				component: ConnectFourMapTab,
				icon: TbMap
			}

const snakeMapData : TabData = {
	name: "Map",
	component: SnakeMap,
	icon: TbMap
}
const tabIndex = {
	log: logTabData,
	challenges: challengeTabData,
	connect_four_map: connectFourMapData,
	snake_map: snakeMapData
}


type TabCodes = keyof typeof tabIndex

export default function TabSet({tabCodes} : {tabCodes : TabCodes[]}) {
	console.log("rendering match");
	const props: GameBoardContext = useContext(GameContext);

	const [activeTab, setActiveTab] = useState<string | null>(null);
	return (
		<Tabs defaultValue={"log"} variant="pills" radius={0} id="matchContainer" onChange={setActiveTab}>
			{tabCodes.map(tabCode => {
				const tab = tabIndex[tabCode]
				return (
					<TabsPanel key={tabCode} value={tab.name} style={panelLayout}>
						<ErrorBoundary
							fallback={<span>Something went wrong in {tab.name} tab</span>}>
							<tab.component active={activeTab} />
						</ErrorBoundary>
					</TabsPanel>
				)
			})}
			<TabsList
				style={TabListStyles}
				p="0"
				bg="white"
				grow={true}>
				{tabCodes.map(tabCode => {
					const tab = tabIndex[tabCode]
					return (
						<TabsTab key={tab.name} value={tab.name} flex="1"><Group gap="0.2rem" fz="md" wrap="nowrap"><tab.icon size="1rem" /><span>{tab.name}</span></Group></TabsTab>
					)
				})}
			</TabsList>
		</Tabs>
	);
}

export const tabHeight = "3em"

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
	marginTop: "2em"
}

const TabListStyles: React.CSSProperties = {
	height: tabHeight,
	flexShrink: 0,
	position: "fixed",
	bottom: "0",
	left: "0",
	right: "0",
}

