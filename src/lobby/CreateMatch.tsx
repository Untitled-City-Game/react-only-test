import { cities, games, maps } from "@/scripts/consts";
import { fetchMapData } from "@/scripts/fetchMapData";
import { joinMatch } from "@/scripts/joinMatch";
import {
	City,
	isCity,
	MatchMapData,
	NamedColor,
	PlayerData
} from "@/scripts/types/types";
import Loading from "@/src/match/screens/game_status/Loading";
import Span from "@/src/userInterface/Span";
import {
	Button,
	Group,
	LoadingOverlay,
	Paper,
	Radio,
	Select,
	Stack,
	TextInput
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function CreateGame() {
	const gameCode = useParams().gameCode;
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	const teamOptions = [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	];

	const teamCards = teamOptions.map((item) => (
		<Radio.Card radius="md" value={item.value} key={item.value}>
			<Paper radius="md" p="md">
				<Group wrap="nowrap" align="center">
					<Radio.Indicator 
					iconColor='white'
					color={item.value} 
					size="lg" />
					<div>
						<Span>{item.label}</Span>
					</div>
				</Group>
			</Paper>
		</Radio.Card>
	));

	//Setup mantine form
	const createGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			city: "melbourne" as City,
			teamColor: "blue" as NamedColor,
			//numPlayers: numPlayers,
			gameName: "",
		},
		validate: {
			PlayerName: hasLength(
				{ min: 2, max: 20 },
				"Player name must be between 2 and 20 characters"
			),
			city: (city) =>
				cities.includes(city as City) ? null : "Invalid city",
			teamColor: (teamColor) =>
				teamOptions.map((option) => option.value).includes(teamColor)
					? null
					: "Invalid team",
			gameName: hasLength(
				{ min: 2, max: 20 },
				"Game name must be between 2 and 20 characters"
			),
			//numPlayers: numPlayers => numPlayers > 1 && numPlayers < 100 ? null: "Invalid number of players"
		},
	});

	type FormValues = {
		PlayerName: string;
		city: City;
		teamColor: NamedColor;
		gameName: string;
		// numPlayers: number;
	};
	const handleCreateGame = async (values: FormValues) => {
		if(!gameCode){throw new Error("No game code provided")}
		console.log("creating game", values);
		//get map data
		if (!isCity(values.city)) {
			throw new Error("Invalid city");
		}

		//match setup
		const mapSetupData: MatchMapData = await fetchMapData(values.city);

		//create match
		console.log("setting up match")
		const { matchID } = await lobbyClient.createMatch(gameCode, {
			numPlayers: 20,
			setupData: {
				mapSetupData,
				gameName: values.gameName
			},
		});
		console.log("joining match")
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
	};

	return (
		<form style={{width: "100%"}} onSubmit={createGameForm.onSubmit(handleCreateGame)}>
			<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Joining match..." /> }} />
			<h2>Create a {games.filter(game => game.code === gameCode)[0].name} match</h2>
			<Stack pb="sm">
				<Select
					label="Choose a city"
					placeholder="Melbourne"
					data={Object.values(maps).map(map => ({ label: map.name, value: map.code }))}
					key={createGameForm.key("city")}
					{...createGameForm.getInputProps("city")}
				/>
				<TextInput
					fz="lg"
					label="Your name"
					key={createGameForm.key("PlayerName")}
					{...createGameForm.getInputProps("PlayerName")}
				/>
				<TextInput
					label="Game name"
					placeholder="My Connect Four Game"
					key={createGameForm.key("gameName")}
					{...createGameForm.getInputProps("gameName")}
				/>
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
	);
}
