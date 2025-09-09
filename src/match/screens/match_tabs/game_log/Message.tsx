import { LogMetadata, PlayerData, GameStateGeneric, GameBoardContextSpecific, GameStateAnything } from "@/scripts/types/types";
import { ClaimChallengeCompleted, ChallengeEvidence, FruitEaten } from "@/src/match/screens/match_tabs/game_log/messages/ChallengeCompleted";
import { DiscardHand } from "@/src/match/screens/match_tabs/game_log/messages/DiscardHand";
import { GameStarted } from "@/src/match/screens/match_tabs/game_log/messages/GameStarted";
import { JoinedMatch } from "@/src/match/screens/match_tabs/game_log/messages/JoinedMatch";
import { MessageBox, MessageWrapper } from "@/src/match/screens/match_tabs/game_log/MessageBox";
import { ChallengeButton } from "@/src/match/screens/match_tabs/challenges/UI/ChallengePopup";
import P from "@/src/userInterface/P";
import { Avatar, Box } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext } from "react";
import { GameContext } from "@/src/match/Board";


export function Message({ entry, gameData, playerData }: { entry: LogEntry; gameData: GameStateGeneric; playerData: PlayerData; }) {
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	const gameState: GameBoardContextSpecific<GameStateAnything> = useContext(GameContext);

	switch (entry.action.payload.type) {
		case "completeChallengeAndClaim":
			const challenge = gameState.G.challengeDeck!.find(challenge => challenge.title === entry.metadata.challenge)
			return (
				<Box>					
					<MessageBox entry={entry} gameData={gameData} playerData={playerData} >
						<ClaimChallengeCompleted
							metadata={entry.metadata as LogMetadata} />
						{challenge ? <ChallengeButton
							team={entry.metadata.team}
							challenge={challenge}
							completed={true}
							claimButton={false}
						/>
							: null}
					</MessageBox>
			
					<MessageWrapper entry={entry} gameData={gameData} playerData={playerData} unstyled={true}>
						<ChallengeEvidence metadata={entry.metadata as LogMetadata} />
					</MessageWrapper>
				</Box>
			);

		case "playerSetup":
			return (
				<MessageBox entry={entry} gameData={gameData} playerData={playerData}>
					<JoinedMatch senderData={senderData} />
				</MessageBox>
			);

		case "startGame":
			return (
				<MessageBox entry={entry} gameData={gameData} playerData={playerData}>
					<GameStarted senderData={senderData} />
				</MessageBox>
			);
		case "discardHand":
			return (
				<MessageBox entry={entry} gameData={gameData} playerData={playerData}>
					<DiscardHand senderData={senderData} />
				</MessageBox>
			)
		case "completeChallengeAndEatFruit":
			return (
				<Box>
					<MessageBox entry={entry} gameData={gameData} playerData={playerData} >
						<FruitEaten
							metadata={entry.metadata as LogMetadata} />
						{entry.metadata.challenge ? <ChallengeButton
							team={entry.metadata.team}
							challenge={entry.metadata.challenge}
							completed={true}
							claimButton={false}
						/>
							: null}
					</MessageBox>
			
					<MessageWrapper entry={entry} gameData={gameData} playerData={playerData} unstyled={true}>
						<ChallengeEvidence metadata={entry.metadata as LogMetadata} />
					</MessageWrapper>
				</Box>
			)
		case "addSegment":
			break;
		case "eatFruit":
			break;
		case "addTeamPhoto":
			break;
		default:
			return <P>{entry.action.payload.type}</P>;
	}
}
