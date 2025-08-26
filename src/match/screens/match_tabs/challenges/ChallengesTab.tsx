import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { ChallengeDeckContext, GameContext } from "@/src/match/Board";
import ClaimFlowModal from "@/src/match/components/regions/region_claim_flow/ClaimFlowModal";
import { ClaimButton } from "@/src/match/screens/match_tabs/challenges/UI/ChallengeCard";
import RuleBox from "@/src/match/screens/match_tabs/challenges/UI/RuleBox";
import ConfirmButton from "@/src/userInterface/ConfirmModal";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import Span from "@/src/userInterface/Span";
import { Box, Container, Stack, Group, Button, ScrollAreaAutosize, Accordion, ScrollArea, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, useState } from "react";
import { FaLock } from "react-icons/fa";


export const ChallengeContext = createContext<any>(null);

export default function ChallengesTab() {
	const { allTeamsChallengeData, } = useContext(ChallengeDeckContext)
	const props = useContext(GameContext)
	const moves = props.moves as ConnectFourMoves; //TODO: Make this generic / composite
	const { allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsChallengeData[myTeam]?.challengeHand;
	const challengeDeck = allTeamsChallengeData[myTeam]?.challengeDeck;
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
			<Box style={{ zIndex: 10 }}>
				<ComplexHeader color={props.playerData.data.teamColor}>
					<Container w="100%">
						<Stack gap="0" ta="center" align="stretch" w="100%">
							{/* <h1>Challenges</h1> */}
							<Group justify="center" m="xs">
								<Span fz="sm">
									{challengeDeck.length} challenges in deck
								</Span>
								<ConfirmButton action={handleDiscardHand} description="discard all your challenges" display="inline-block" size="xs">
									Discard Hand
								</ConfirmButton>
							</Group>
						</Stack>
					</Container>
				</ComplexHeader>
			</Box>
			<ScrollArea>
				<Container mih="0" w="100%">
					<Stack className="challengeButtonStack" pb="md" pt="md" w="100%" h="100%" justify="center" >
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
												<Stack mb="sm">
													{challenge.rules.filter(rule => rule).map((rule, index) => { 
														return (<RuleBox key={index}>{rule}</RuleBox>)})}
												</Stack>
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
			</ScrollArea>
			<ClaimFlowModal
				open={opened}
				close={close}
				challengeTitle={currentChallenge}
			/>
		</>
	);
}