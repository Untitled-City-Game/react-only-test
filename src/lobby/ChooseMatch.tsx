import Span from "@/src/userInterface/Span";
import { Button, Center, Group, Paper, Radio, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function ChooseMatch() {
	let navigate = useNavigate();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.NEXT_PUBLIC_GAME_SERVER }), []);

	//Get all matches
	const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);

	useEffect(() => {
		lobbyClient.listMatches('connect-four').then(res => {
			console.log("matches", res.matches);
			const activeMatches = res.matches.filter(match => !match.gameover);
			setMatches(activeMatches);
		}
		);
	},
	[lobbyClient])

	//Setup mantine form
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			MatchID: "",
		},
	});

	//Render radio cards for matches
	const matchCards = matches.map((match) => (
		<Radio.Card radius="md" value={match.matchID} key={match.matchID}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator size="lg" color="orange" />
				<div>
					<Span>City: {match.setupData.city}</Span>
					<Span>Gameover: {match.setupData.gameover}</Span>
					<Span>
						{ match.players?.length ? `Current players: ${match.players.map(player => player.name).filter(name => name).join(", ")}` : 'Empty' }
					</Span>
				</div>
			</Group>
			</Paper>
		</Radio.Card>
	));

	//Handle radio card selection
	const handleJoinGame = async (values : Record<string, string>) => {
		console.log(values)
		navigate('/lobby/join-match/' + values.MatchID);
	}

	return (
		<Center>
		<h1>Connect Four Lobby</h1>
		<Button component={Link} to="/game/lobby/create-match">Create New Game</Button>
		<h2>Join a game</h2>

			<form
				onSubmit={joinGameForm.onSubmit(handleJoinGame)}>
					<Stack>
						<h2>Choose a Match</h2>
						<Radio.Group
							label="Choose a match"
							key={joinGameForm.key("MatchID")}
							{...joinGameForm.getInputProps("MatchID")}
						>
						{matchCards}
						</Radio.Group>
						<Button type="submit">Join</Button>
					</Stack>
				</form>
		</Center>
		);
}