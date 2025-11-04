import { Challenge } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { Color } from "@/scripts/types/types";
import { ChallengeContext } from "@/src/match/screens/match_tabs/challenges/ChallengesTab";
import { ChallengeBody } from "@/src/match/screens/match_tabs/challenges/UI/ChallengePopup";
import DashedCard from "@/src/userInterface/DashedCard";
import Span from "@/src/userInterface/Span";
import { Button, CardProps, Container } from "@mantine/core";
import { useContext } from "react";
import { FaLock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

export function ChallengeCard(props: { teamColor: Color; challenge: Challenge; completed? : boolean; claimButton? : boolean } & CardProps & React.HTMLAttributes<HTMLDivElement>) {
	return (<DashedCard 
	color={props.teamColor} 
	bd={props.challenge.hard ? `4px solid ${props.teamColor}` : `1.5px dashed ${props.teamColor}`}
	>
		<Container w="100%">
			<h3 style={{fontWeight: "bold"}}>{props.challenge.emoji} {props.challenge.title}</h3>
			<ChallengeBody challenge={props.challenge} teamColor={props.teamColor} />
		</Container>
	</DashedCard>);
}

export function ClaimButton(props: {title: string}){
	const {open, setCurrentChallenge} = useContext(ChallengeContext)
	return(
			<Button onClick={() => {
				setCurrentChallenge(props.title)
				open()
				}} w="100%">
				Complete and claim
			</Button>

	)

}

const punchStyle : React.CSSProperties = {
	position: "absolute",
	top: "10px",
	right: "20px"
}