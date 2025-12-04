import { games } from "@/scripts/consts";
import { HelpButton } from "@/src/match/components/help/HelpButton";
import Segment from "@/src/userInterface/Segment";
import { Box, Button, Group, Stack, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { PrepButton } from "@/src/lobby/GamePrep";
import GameIntro from "@/src/lobby/GameIntro";
import { GameMeta } from "@/scripts/types/types";

export default function LobbyLanding() {
	const gameCode = useParams().gameCode;
	const theme = useMantineTheme();
	const game : GameMeta | undefined = games.find((game) => game.code === gameCode);

	return (
		<>
			<Stack>
				<GameIntro game={game} />
				<Group justify="stretch" wrap="nowrap">
					<PrepButton />
					<HelpButton />
				</Group>
				<Segment color={theme.primaryColor || "black"}>
					<Stack gap="0">
						<h2 style={{ margin: "0 0 0.5rem 0" }}>Create a match</h2>
						<Button
							fz="md"
							fw="normal"
							component={Link}
							to={`/lobby/${game?.code}/create-match`}>
							Create
						</Button>
					</Stack>
				</Segment>
				<Segment color={theme.primaryColor || "black"}>
					<Stack gap="0">
						<h2 style={{ margin: "0 0 0.5rem 0" }}>Join a match</h2>
						<JoinMatchCodeInput gameCode={gameCode || ""} />
					</Stack>
				</Segment>

			</Stack>

		</>
	);
}

function JoinMatchCodeInput({ gameCode }: { gameCode: string }) {
	const [matchID, setMatchID] = useState('');
	return (
		<Group align="end">
			<TextInput
				label="Invite code"
				value={matchID}
				onChange={(event) => setMatchID(event.currentTarget.value)}
			/>
			<Button component="a" href={`${process.env.GAME_ADDRESS}/lobby/${gameCode}/join-match/${matchID}`}>Join</Button>
		</Group>
	)
}