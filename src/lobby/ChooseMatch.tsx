import { StrictMatch } from "@/scripts/types";
import Span from "@/src/userInterface/Span";
import { Button, Group, Paper, Radio, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function ChooseMatch() {
	let navigate = useNavigate();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.GAME_SERVER }), []);

	//Get all matches
	const [matches, setMatches] = useState<StrictMatch[]>([]);

	useEffect(() => {
		lobbyClient.listMatches('connect-four').then(res => {
			console.log("matches", res.matches);
			const matches = res.matches as StrictMatch[];
			const activeMatches = matches.filter(match => !match.gameover);
			console.log('active matches', activeMatches);
			const availableMatches = activeMatches.filter(match => {
				const maxPlayers = match.players.length
				const numPlayers = match.players.filter(player => player.name).length;
				console.log('maxPlayers', maxPlayers, 'numPlayers', numPlayers);
				return maxPlayers > numPlayers;

			});
			console.log('available matches', availableMatches);
			setMatches(availableMatches);
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
					{/* <Span>Gameover: {match.setupData.gameover}</Span> */}
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
		<>
			<h1>Connect Four Lobby</h1>
			<Button component={Link} to="/lobby/create-match">Create New Game</Button>
			<h2>Join a game</h2>
				<form
					onSubmit={joinGameForm.onSubmit(handleJoinGame)}>
						<Stack>
							<Radio.Group
								label="Choose a match"
								key={joinGameForm.key("MatchID")}
								{...joinGameForm.getInputProps("MatchID")}
							>
							<Stack>{matchCards}</Stack>
							</Radio.Group>
							<Button type="submit">Join</Button>
						</Stack>
					</form>
		</>
		);
}