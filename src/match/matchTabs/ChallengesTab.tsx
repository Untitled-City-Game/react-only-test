import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import ClaimFlowModal from "@/src/match/claim/ClaimFlowModal";
import { ChallengeButton } from "@/src/userInterface/challenges/ChallengePopup";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import StatusBar from "@/src/userInterface/StatusBar";
import { Box, Button, Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, useState } from "react";

export const ChallengeContext = createContext<any>(null);

export default function ChallengesTab() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	//TODO: hoist this
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	const challengeDeck = allTeamsData[myTeam]?.challengeDeck;
	const [opened, { open, close }] = useDisclosure(false);
	const [currentChallenge, setCurrentChallenge] = useState("");
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	function handleDiscardHand() {
		console.log("discarding hand");
		moves.discardHand();
	}
	return (
		<>


			<Box pos="sticky" top={0} style={{ zIndex: 10 }}>
				<StatusBar />
				<ComplexHeader color={props.playerData.data.teamColor}>
					<Container w="100%">
						<Stack gap="0" ta="center" align="stretch" w="100%">
							<h1>Challenges</h1>
							<Button onClick={handleDiscardHand}>
								Discard Hand
							</Button>
							<p>
								{challengeDeck.length} challenges left in deck
							</p>
						</Stack>
					</Container>
				</ComplexHeader>
			</Box>
			<Container mih="0" mt="md" style={{
				flexGrow: 10,
				overflowY: "scroll"
			}}>
				<Stack pb="md">
					<ChallengeContext value={{open, setCurrentChallenge}}>
					{challengeHand.map((challenge, index) => {
						return (
							// <ChallengeCard key={index} teamColor={props.playerData.data.teamColor} onClick={() => {
							// 	setCurrentChallenge(challenge.title);
							// 	console.log("opening modal");
							// 	open();
							// }
							// } challenge={challenge}></ChallengeCard>
						<ChallengeButton challenge={challenge} key={index} team={props.playerData.data.teamColor} claimButton={true} />
						);
					})}
					</ChallengeContext>
				</Stack>
			</Container>
			<ClaimFlowModal
				open={opened}
				close={close}
				challengeTitle={currentChallenge}
			/>
		</>
	);
}