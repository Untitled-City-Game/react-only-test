import { GameContext } from "@/src/match/boardGame/Board";
import { theme } from "@/styles/theme";
import { Container, Group } from "@mantine/core";
import { useContext } from "react";
import Countdown from 'react-countdown';
import Span from "./Span";

export default function Header({ children }: { children: React.ReactNode }) {
	const {G, playerData} = useContext(GameContext);
	const claimedZones = G.zoneData.filter(zone => zone.color === playerData.data.teamColor).length
	return (
			<Container style={headerStyles} className="header">
				<Group justify="center" align="center">
					<Span size="xs">{claimedZones} neighbourhood{claimedZones === 1 ? "" : "s"} claimed</Span>
					<Span size="xs">Time remaining: <Countdown 
					date={new Date(G.endTime || 0)} 
					renderer={
						props => <span>{props.hours}h {props.minutes}m {props.seconds}s</span>
					}
					/></Span>
				</Group>
				{children}
			</Container>
	);
}

const headerStyles = {
	position: "sticky" as const,
	top: 0,
	backgroundColor: theme.white,
	width: "100%",
	zIndex: 1,
	padding: "1rem",
};