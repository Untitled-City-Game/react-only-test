import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import Header from "@/src/userInterface/Header";
import { Button, Container, Group, Paper, Stack } from "@mantine/core";
import { useContext } from "react";

export default function ChallengesTab() {
	const props: MetroGameBoardProps = useContext(GameContext);
	//TODO: hoist this
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	return (
		<>
			<Header>
				<h1>Challenges</h1>
				<Group>
						<Button>Discard Hand</Button>
					</Group>

			</Header>
			<Container mih="0">
				<Stack pb="md">
				{challengeHand.map((challenge, index) => {
					return (
						<Paper
							key={index}
							shadow="xs"
							withBorder
							p="md"
							radius="md">
							<h3>{challenge.title}</h3>
							<p>{challenge.description}</p>
						</Paper>
					);
				})}
				</Stack>
			</Container>
		</>
	);
}
