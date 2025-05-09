import { cities } from "@/scripts/consts";
import { fetchMapData } from "@/scripts/fetchMapData";
import { joinMatch } from "@/scripts/joinMatch";
import {
	City,
	isCity,
	MatchMapData,
	NamedColor,
	PlayerData,
} from "@/scripts/types";
import Span from "@/src/userInterface/Span";
import {
	Button,
	Group,
	Paper,
	Radio,
	Select,
	Stack,
	TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

export default function CreateGame() {
	const gameCode = useParams().gameCode;
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
			GameName: "",
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
			GameName: hasLength(
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
		GameName: string;
		// numPlayers: number;
	};
	const handleCreateGame = async (values: FormValues) => {
		console.log("creating game", values);
		//get map data
		if (!isCity(values.city)) {
			throw new Error("Invalid city");
		}
		// const mapDataRes = await fetch(process.env.GAME_SERVER + "/map-data/" + values.city).catch(e => {
		// 	throw new Error("Error fetching map data");
		// });
		// const mapDataResJSON = await mapDataRes.json();

		//match setup
		const setupData: MatchMapData = await fetchMapData(values.city);

		//create match
		const { matchID } = await lobbyClient.createMatch("connect-four", {
			numPlayers: 20,
			setupData: setupData,
		});

		//join match
		const playerData: PlayerData = await joinMatch(
			lobbyClient,
			matchID,
			values.PlayerName,
			values.teamColor
		);
		localStorage.setItem("localPlayerData", JSON.stringify(playerData));
		navigate("/match");
	};

	return (
		<form style={{width: "100%"}} onSubmit={createGameForm.onSubmit(handleCreateGame)}>
			<h2>Create a Connect Four Match</h2>
			<Stack>
				<Select
					label="Choose a city"
					placeholder="Melbourne"
					data={cities}
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
					key={createGameForm.key("GameName")}
					{...createGameForm.getInputProps("GameName")}
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
