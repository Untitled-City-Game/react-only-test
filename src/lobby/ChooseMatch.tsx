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
	console.timeLog("load", "choose match");
	let navigate = useNavigate();
	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	//Get all matches
	// const [matches, setMatches] = useState<StrictMatch[]>([]);
	// const [loadingMatches, setLoadingMatches] = useState(true);

	// useEffect(() => {
	// 	console.timeLog("load", "list matches effect");
	// 	const fetchMatches = async () => {
	// 		try {
	// 			//const res = await lobbyClient.listMatches('connect-four');
	// 			const resString = await fetch(
	// 				process.env.GAME_SERVER + "/games/connect-four"
	// 			);
	// 			const res = await resString.json();
	// 			console.timeLog("load", "received matches", res.matches);
	// 			const matches = res.matches as StrictMatch[];
	// 			const activeMatches = matches.filter(
	// 				(match) => !match.gameover && match.players.length > 0
	// 			);
	// 			const availableMatches = activeMatches.filter((match) => {
	// 				const maxPlayers = match.players.length;
	// 				const numPlayers = match.players.filter(
	// 					(player) => player.name
	// 				).length;
	// 				return maxPlayers > numPlayers;
	// 			});
	// 			console.timeLog("load", "set matches");
	// 			setLoadingMatches(false);
	// 			setMatches(availableMatches);
	// 		} catch (e) {
	// 			console.log("error listing matches", e);
	// 			setLoadingMatches(false);
	// 			setMatches([]);
	// 			return;
	// 		}
	// 	};
	// 	fetchMatches();
	// }, [lobbyClient]);

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

	//Render radio cards for matches
	// const matchCards = matches.map((match) => (
	// 	<ListButton
	// 		component={Radio.Card}
	// 		value={match.matchID}
	// 		key={match.matchID}
	// 		color={game?.color || "gray"}>
	// 		<Radio.Indicator
	// 			size="lg"
	// 			color={game?.color || "gray"}
	// 			iconColor="white"
	// 		/>
	// 		<div>
	// 			<P fw="bold" fz="lg">{match?.setupData?.gameName || "game_name"}</P>
	// 			<P tt="capitalize">{match?.setupData?.mapSetupData?.city}</P>
	// 			{match.gameover ? (
	// 				<Span fs="italic" opacity={0.6}>
	// 					This game has ended.
	// 				</Span>
	// 			) : null}
	// 		</div>
	// 	</ListButton>
	// ));

	//Handle radio card selection
	const handleJoinGame = async (values: Record<string, string>) => {
		console.log(values);
		navigate(`/lobby/${game?.code}/join-match/${values.MatchID}`);
	};

	// const chooseMatchFormElement =
	// 	matches.length > 0 ? (
	// 		<form
	// 			onSubmit={joinGameForm.onSubmit(handleJoinGame)}
	// 			style={scrollParent}>
	// 			<Stack style={scrollParent}>
	// 				<Radio.Group
	// 					style={scrollSacrifice}
	// 					key={joinGameForm.key("MatchID")}
	// 					{...joinGameForm.getInputProps("MatchID")}>
	// 					<Stack>{matchCards}</Stack>
	// 				</Radio.Group>
	// 				<Button fz="md" fw="normal" type="submit" disabled={joinGameForm.getValues().MatchID ? false : true}>
	// 					Join
	// 				</Button>
	// 			</Stack>
	// 		</form>
	// 	) : (
	// 		<Span>No matches available.</Span>
	// 	);

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