import { games } from "@/scripts/consts";
import { HelpButton } from "@/src/userInterface/help/HelpButton";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

export default function ChooseMatch() {
	const gameCode = useParams().gameCode;
	const game = games.find((game) => game.code === gameCode);
	let navigate = useNavigate();
	//Setup mantine form
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			MatchID: "",
		},
		validate: {
			MatchID: (value) =>
				value.length > 0 ? null : "Please select a match",
		},
	});


	//Handle radio card selection
	const handleJoinGame = async (values: Record<string, string>) => {
		console.log(values);
		navigate(`/lobby/${game?.code}/join-match/${values.MatchID}`);
	};

	return (
		<>
			<Stack>
				<Stack gap="0">
					<h2>Create a match</h2>
					<Button
						fz="md"
						fw="normal"
						component={Link}
						to={`/lobby/${game?.code}/create-match`}>
						Create
					</Button>
				</Stack>
				<Stack gap="0">
					<h2>Join a match</h2>
					<JoinMatchCodeInput gameCode={gameCode || ""} />
				</Stack>
				<Stack gap="0">
					<h2>Help</h2>
					<HelpButton />
				</Stack>
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