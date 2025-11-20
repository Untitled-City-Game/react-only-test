import { games } from "@/scripts/consts";
import { City, NamedColor, PlayerData } from "@/scripts/types/types";
import Loading from "@/src/match/screens/game_status/Loading";
import Span from "@/src/userInterface/Span";
import { Radio, Paper, Group, LoadingOverlay, Stack, TextInput, Button } from "@mantine/core";
import { hasLength, useForm, UseFormReturnType } from "@mantine/form";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { LobbyClient } from "boardgame.io/client";
import { joinMatch } from "@/scripts/joinMatch";

interface CreateGameFormUniversal extends UseFormReturnType<any> {}

export type FormValues = {
	PlayerName: string;
	teamColor: NamedColor;
	gameName: string;
	city?: City;
	[key:string]: any;
};

export default function CreateMatchTemplate({
	teamOptions,
	gameCode,
	getSetupData,
	createGameForm,
	children
} : {
	teamOptions : string[]
	gameCode : string
	getSetupData : (args : FormValues) => Record<string, unknown> | Promise<Record<string, unknown>>;
	createGameForm : CreateGameFormUniversal;
	children : React.ReactNode
}){
	const [loading, setLoading] = useState(false);
	const teamCards = createTeamCards(teamOptions);
	const navigate = useNavigate();
	
	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	async function handleCreateGame(values: FormValues) {
		setLoading(true);
		if (!gameCode) { throw new Error("No game code provided"); }
		const setupData = await getSetupData(values);
		console.log("creating game", values, setupData);
		console.log("env game server", process.env.GAME_SERVER)
		console.log("env location server", process.env.LOCATION_SERVER)
		console.log("env location server path", process.env.LOCATION_SERVER_PATH)
		//create match
		console.log("setting up match");
		const { matchID } = await lobbyClient.createMatch(gameCode, {
			numPlayers: 20,
			setupData
		});
		console.log("joining match");
		//join match
		const playerData: PlayerData = await joinMatch(
			lobbyClient,
			gameCode,
			matchID,
			values.PlayerName,
			values.teamColor,
			true
		);
		localStorage.setItem("localPlayerData", JSON.stringify(playerData));
		navigate("/match");
	}

	
	return (
	<>
		<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Joining match..." /> }} />
		<form style={{ width: "100%" }} onSubmit={createGameForm.onSubmit(handleCreateGame)}>
			<h2>Create a {games.filter(game => game.code === gameCode)[0].name} match</h2>
			<Stack pb="sm">
				<TextInput
					fz="lg"
					label="Your name"
					key={createGameForm.key("PlayerName")}
					{...createGameForm.getInputProps("PlayerName")}
				/>
				<TextInput
					label="Game name"
					placeholder="My Game"
					key={createGameForm.key("gameName")}
					{...createGameForm.getInputProps("gameName")}
				/>
				{children}
				<Radio.Group
					label="Choose a team"
					key={createGameForm.key("teamColor")}
					{...createGameForm.getInputProps("teamColor")}>
					<Stack gap="xs">
						{teamCards}
					</Stack>
				</Radio.Group>
				<Button type="submit">Create and Join</Button>
			</Stack>
		</form>
	</>
	)
}

function createTeamCards(teamOptions: string[]) {
	return teamOptions.map((team) => (
		<Radio.Card radius="md" value={team} key={team}>
			<Paper radius="md" p="md">
				<Group wrap="nowrap" align="center">
					<Radio.Indicator
						iconColor='white'
						color={team}
						size="lg" />
					<div>
						<Span>{team}</Span>
					</div>
				</Group>
			</Paper>
		</Radio.Card>
	));
}



export function createGameFormConstructor(formValues : Record<string, any>, validators : Record<string, any>, teamOptions : string[]) {
	return useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamColor: "blue" as NamedColor,
			//numPlayers: numPlayers,
			gameName: "",
			...formValues
		},
		validate: {
			PlayerName: hasLength(
				{ min: 2, max: 20 },
				"Player name must be between 2 and 20 characters"
			),
			teamColor: (teamColor) =>
				teamOptions.map((option) => option).includes(teamColor)
					? null
					: "Invalid team",
			gameName: hasLength(
				{ min: 2, max: 20 },
				"Game name must be between 2 and 20 characters"
			),
			...validators
		},
	});
	
}