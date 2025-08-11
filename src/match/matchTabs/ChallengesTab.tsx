import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import { MetroGameBoardProps } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import ClaimFlowModal from "@/src/match/claim/ClaimFlowModal";
import { ClaimButton } from "@/src/userInterface/challenges/ChallengeCard";
import { ChallengeButton } from "@/src/userInterface/challenges/ChallengePopup";
import DashedCard from "@/src/userInterface/DashedCard";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import Span from "@/src/userInterface/Span";
import StatusBar from "@/src/userInterface/StatusBar";
import { Accordion, Box, Button, Container, Group, ScrollArea, ScrollAreaAutosize, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, useState } from "react";
import { FaLock } from "react-icons/fa6";

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
							{/* <h1>Challenges</h1> */}
							<Group justify="center" m="xs">
								<Span fz="sm">
									{challengeDeck.length} challenges in deck
								</Span>
								<Button onClick={handleDiscardHand} display="inline-block" size="xs">
									Discard Hand
								</Button>
							</Group>
						</Stack>
					</Container>
				</ComplexHeader>
			</Box>
			<ScrollAreaAutosize>
			<Container mih="0" w="100%">
				<Stack pb="md" pt="md" w="100%" h="100%" justify="center" >
					<ChallengeContext value={{ open, setCurrentChallenge }}>
						<Accordion variant="separated">
							{challengeHand.map((challenge, index) => {
								return (
									// <ChallengeCard key={index} teamColor={props.playerData.data.teamColor} onClick={() => {
									// 	setCurrentChallenge(challenge.title);
									// 	console.log("opening modal");
									// 	open();
									// }
									// } challenge={challenge}></ChallengeCard>
									// <ChallengeButton challenge={challenge} key={index} team={props.playerData.data.teamColor} claimButton={true} />
									<Accordion.Item
									bd={challenge.hard ? `4px double ${props.playerData.data.teamColor}` : `1.5px dashed ${props.playerData.data.teamColor}`}
									style={{
										borderRadius: "10px"
									}}
									bg={"white"}
									key={index} 
									value={challenge.title} >
										<Accordion.Control icon={challenge.emoji}>{challenge.title}</Accordion.Control>
										<Accordion.Panel>
											<div>{challenge.description.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div>
												<ClaimButton title={challenge.title} />
												<div>
													{challenge.hard ? <>
													<FaLock color={props.playerData.data.teamColor} />
														<Span style={{
															fontStyle: "italic"
														}}> Hard - this challenge can lock or steal a zone</Span></> : null}
												</div>
										</Accordion.Panel>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</ChallengeContext>
				</Stack>
			</Container>
			</ScrollAreaAutosize>
			<ClaimFlowModal
				open={opened}
				close={close}
				challengeTitle={currentChallenge}
			/>
		</>
	);
}