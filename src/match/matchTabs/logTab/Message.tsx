import { ConnectFourGameState, LogMetadata, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { ChallengeCompleted, ChallengeEvidence } from "@/src/match/matchTabs/logTab/ChallengeCompleted";
import { DiscardHand } from "@/src/match/matchTabs/logTab/DiscardHand";
import { GameStarted } from "@/src/match/matchTabs/logTab/GameStarted";
import { JoinedMatch } from "@/src/match/matchTabs/logTab/JoinedMatch";
import { MessageBox, MessageWrapper } from "@/src/match/matchTabs/logTab/MessageBox";
import { ChallengeButton } from "@/src/userInterface/challenges/ChallengePopup";
import P from "@/src/userInterface/P";
import { Box } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext } from "react";


export function Message({ entry, gameData, playerData }: { entry: LogEntry; gameData: ConnectFourGameState; playerData: PlayerData; }) {
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	const gameState: MetroGameBoardProps = useContext(GameContext);

	switch (entry.action.payload.type) {
		case "completeChallengeAndClaim":
			const challenge = gameState.G.challengeDeck.find(challenge => challenge.title === entry.metadata.challenge)
			return (
				<Box>
					<MessageBox entry={entry} gameData={gameData} playerData={playerData} >
						<ChallengeCompleted
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
		default:
			return <P>{entry.action.payload.type}</P>;
	}
}
