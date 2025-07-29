import { GameState, LogMetadata, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { ChallengeCompleted, ChallengeEvidence } from "@/src/match/matchTabs/logTab/ChallengeCompleted";
import { GameStarted } from "@/src/match/matchTabs/logTab/GameStarted";
import { JoinedMatch } from "@/src/match/matchTabs/logTab/JoinedMatch";
import { MessageBox } from "@/src/match/matchTabs/logTab/MessageBox";
import { ChallengeButton } from "@/src/userInterface/challenges/ChallengePopup";
import P from "@/src/userInterface/P";
import { Box } from "@mantine/core";
import { LogEntry } from "boardgame.io";
import { useContext } from "react";


export function Message({ entry, gameData, playerData }: { entry: LogEntry; gameData: GameState; playerData: PlayerData; }) {
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	const gameState: MetroGameBoardProps = useContext(GameContext);
	const challenge = gameState.G.challengeDeck.find(challenge => challenge.title === entry.metadata.challenge)

	switch (entry.action.payload.type) {
		case "completeChallengeAndClaim":
			return (
				<Box>
					<MessageBox entry={entry} gameData={gameData} playerData={playerData} >
						<ChallengeCompleted
							metadata={entry.metadata as LogMetadata} />
						{challenge ? <p><ChallengeButton
							team={entry.metadata.team}
							challenge={challenge}
							completed={true}
							claimButton={false}
						/></p>
							: null}
					</MessageBox>
					<Box
						ml={senderData.playerID === playerData.playerID ? "auto" : "0"}
					>
						<ChallengeEvidence metadata={entry.metadata as LogMetadata} />
					</Box>
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

		default:
			return <P>{entry.action.payload.type}</P>;
	}
}
