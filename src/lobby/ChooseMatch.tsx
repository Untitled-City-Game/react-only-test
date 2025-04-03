import { StrictMatch } from "@/scripts/types";
import Loading from "@/src/match/boardGame/Loading";
import Span from "@/src/userInterface/Span";
import { Button, Center, Group, Paper, Radio, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function ChooseMatch() {
	console.timeLog("load", "choose match");
	let navigate = useNavigate();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.GAME_SERVER }), []);

	//Get all matches
	const [matches, setMatches] = useState<StrictMatch[]>([]);
	const [loadingMatches, setLoadingMatches] = useState(true);

	useEffect(() => {
		console.timeLog("load", "list matches effect");
		lobbyClient.listMatches('connect-four').then(res => {
			console.timeLog("load", "received matches");
			const matches = res.matches as StrictMatch[];
			const activeMatches = matches.filter(match => !match.gameover);
			const availableMatches = activeMatches.filter(match => {
				const maxPlayers = match.players.length
				const numPlayers = match.players.filter(player => player.name).length;
				return maxPlayers > numPlayers;

			});
			console.timeLog("load", "set matches");
			setLoadingMatches(false);
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

	const chooseMatchFormElement = matches.length > 0 ? <form
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
	</form> : <Span>No matches available.</Span>;

	return (
		<Center>
			<Stack>
				<h1>Connect Four Lobby</h1>
				<h2>Join a game</h2>
				{loadingMatches ? <Loading message="Loading matches"/>: chooseMatchFormElement}
				<Button component={Link} to="/lobby/create-match">Create New Game</Button>
			</Stack>
		</Center>
		);
}