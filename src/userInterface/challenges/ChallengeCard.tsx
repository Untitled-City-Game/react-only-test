import { Challenge, Color } from "@/scripts/types";
import DashedCard from "@/src/userInterface/DashedCard";
import Span from "@/src/userInterface/Span";
import { CardProps, Container } from "@mantine/core";
import { FaLock } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

export function ChallengeCard(props: { teamColor: Color; challenge: Challenge; completed? : boolean } & CardProps & React.HTMLAttributes<HTMLDivElement>) {
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

const punchStyle : React.CSSProperties = {
	position: "absolute",
	top: "10px",
	right: "20px"
}