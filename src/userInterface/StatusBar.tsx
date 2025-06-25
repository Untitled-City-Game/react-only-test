import { GameContext } from "@/src/match/boardGame/Board";
import { theme } from "@/src/styles/theme";
import HelpIcon from "@/src/userInterface/help/HelpButton";
import { Center, Group } from "@mantine/core";
import { useContext } from "react";
import Countdown from 'react-countdown';
import Span from "./Span";

export default function StatusBar({ children }: { children?: React.ReactNode }) {
	const {G, playerData} = useContext(GameContext);
	const claimedZones = G.zoneData.filter(zone => zone.controlTeam === playerData.data.teamColor).length
	return (
			<Center style={statusBarStyles} className="header">
				<Group justify="center" align="center" wrap="nowrap">
					<Span size="xs">{claimedZones} neighbourhood{claimedZones === 1 ? "" : "s"} claimed</Span>
					<Span size="xs"><Countdown 
					date={new Date(G.endTime || 0)} 
					renderer={
						props => <span>{props.hours}h {props.minutes}m {props.seconds}s</span>
					}
					/> remaining</Span>
					<HelpIcon />
				</Group>
				{children}
			</Center>
	);
}

const statusBarStyles = {
	position: "sticky" as const,
	top: 0,
	backgroundColor: theme.white,
	width: "100%",
	zIndex: 1,
	padding: "0.4rem",
};