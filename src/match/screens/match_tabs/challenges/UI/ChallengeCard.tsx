import { Challenge } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { Color } from "@/scripts/types/types";
import { ChallengeContext } from "@/src/match/screens/match_tabs/challenges/ChallengesTab";
import DashedCard from "@/src/userInterface/DashedCard";
import Span from "@/src/userInterface/Span";
import { Button, CardProps, Container } from "@mantine/core";
import { useContext } from "react";
import { FaLock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

export function ChallengeCard(props: { teamColor: Color; challenge: Challenge; completed? : boolean; claimButton? : boolean } & CardProps & React.HTMLAttributes<HTMLDivElement>) {
	return (<DashedCard 
	color={props.teamColor} 
	bd={props.challenge.hard ? `4px double ${props.teamColor}` : `1.5px dashed ${props.teamColor}`}
	>
		<Container w="100%">
			<h3>{props.challenge.emoji} {props.challenge.title}</h3>
			{props.completed ? <div style={punchStyle} >
				<FaStar size="3rem" fill="white" />
			</div> : null}
			<div>{props.challenge.description.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div>
			{props.claimButton ? <ClaimButton title={props.challenge.title} /> : null}
			<div>
				{props.challenge.hard ? <>
				<FaLock color={props.teamColor} />
					<Span style={{
						fontStyle: "italic"
					}}> Hard - this challenge can lock or steal a zone</Span></> : null}
			</div>
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