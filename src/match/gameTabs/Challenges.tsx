import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/Board";
import Header from "@/src/userInterface/Header";
import { Container, Stack, Group, Button, Paper } from "@mantine/core";
import { useContext } from "react";


export default function Challenges(){
	const props: MetroGameBoardProps = useContext(GameContext);
	//TODO: hoist this
	const { allTeamsData, allPlayersData } = props.G; 
	const playerData = allPlayersData[props.playerData.data.playerID]
	const myTeam = playerData.teamColor
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if(!challengeHand){
		return <h1>No challenges available</h1>	
	}
	return(
		<>
		<Header>
			<h1>Challenges</h1>
		</Header>
		<Container mt="md" mb="md">
			<Stack>
				<Group>
					<Button>Discard Hand</Button>
				</Group>
				{challengeHand.map((challenge, index) => {
					return <Paper key={index} shadow="xs" withBorder p="md" radius="md">
						<h3>{ challenge.title}</h3>
						<p>{ challenge.description}</p>
					</Paper>
				})}
			</Stack>
		</Container>
		</>
	)
}