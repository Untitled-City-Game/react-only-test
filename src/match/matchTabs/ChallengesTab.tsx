import { ClaimStateMoves } from "@/scripts/games/connect_four";
import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import DashedCard from "@/src/userInterface/DashedCard";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import StatusBar from "@/src/userInterface/StatusBar";
import { Box, Button, Container, Stack } from "@mantine/core";
import { useContext } from "react";

export default function ChallengesTab() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	//TODO: hoist this
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	const challengeDeck = allTeamsData[myTeam]?.challengeDeck;
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	function handleDiscarHand(){
		console.log("discarding hand");
		moves.discardHand();
	}
	return (
		<>
		<Box pos="sticky" top={0} style={{zIndex: 10000}}>
			<StatusBar />
			<ComplexHeader color={props.playerData.data.teamColor}>
				<Container w="100%">
								<Stack gap="0" ta="center" align="stretch" w="100%">

				<h1>Challenges</h1>
				<Button onClick={handleDiscarHand}>Discard Hand</Button>
				<p>{challengeDeck.length} challenges left in deck</p>
				</Stack>
				</Container>
			</ComplexHeader>
			</Box>
			<Container mih="0" mt="md">
				<Stack pb="md">
				{challengeHand.map((challenge, index) => {
					return (
						<DashedCard
							key={index}
							color={props.playerData.data.teamColor}
							>
								<Container w="100%">
							<h3>{challenge.title}</h3>
							<p>{challenge.description}</p>
							</Container>
						</DashedCard>
					);
				})}
				</Stack>
			</Container>
		</>
	);
}
