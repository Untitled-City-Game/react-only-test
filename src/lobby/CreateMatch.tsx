import { cities, numPlayers } from "@/scripts/consts";
import { fetchMapData } from "@/scripts/fetchMapData";
import { joinMatch } from '@/scripts/joinMatch';
import { City, isCity, MatchMapData, PlayerData } from "@/scripts/types";
import Span from "@/src/userInterface/Span";
import { Button, Center, Group, NumberInput, Paper, Radio, Select, Stack, TextInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useMemo } from "react";
import { useNavigate } from "react-router";

export default function CreateGame() {
	

	const navigate = useNavigate();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.GAME_SERVER }), []);
	
	const teamOptions = [
		{ label: "Red", value: "red"},
		{ label: "Blue", value: "blue" },
	];

	const teamCards = teamOptions.map((item) => (
		<Radio.Card radius="md" value={item.value} key={item.value}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator color={item.label} size="lg" />
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
			teamID: "blue",
			numPlayers: numPlayers,
		},
		validate : {
			PlayerName: hasLength({min: 2, max: 20}, "Player name must be between 2 and 20 characters"),
			city: city => cities.includes(city as City) ? null : "Invalid city",
			teamID: teamID => teamOptions.map(option => option.value).includes(teamID) ? null: "Invalid team",
			numPlayers: numPlayers => numPlayers > 2 && numPlayers < 100 ? null: "Invalid number of players"
		}
	});

	type FormValues = { 
		PlayerName: string; 
		city: City; 
		teamID: string; 
		numPlayers: number; 
	};
	const handleCreateGame = async (values : FormValues) => {
		console.log("creating game", values);
		//get map data
		if(!isCity(values.city)){
			throw new Error("Invalid city");
		}
		// const mapDataRes = await fetch(process.env.GAME_SERVER + "/map-data/" + values.city).catch(e => {
		// 	throw new Error("Error fetching map data");
		// });
		// const mapDataResJSON = await mapDataRes.json();

		//match setup
		const setupData : MatchMapData = await fetchMapData(values.city);

		//create match
		const { matchID } = await lobbyClient.createMatch('connect-four', {
			numPlayers: Number(values.numPlayers),
			setupData: setupData
		});

		//join match
		const playerData: PlayerData = await joinMatch(lobbyClient, matchID, values.PlayerName, values.teamID);
		localStorage.setItem("localPlayerData", JSON.stringify(playerData));
		navigate('/match');
	}

	return (
		<Center>
			<form
				onSubmit={createGameForm.onSubmit(handleCreateGame)}>
				<Stack>
					<h2>Create a Game</h2>
					<Select
						label="Choose a city"
						placeholder="melbourne"
						data={cities}
						key={createGameForm.key("city")}
						{...createGameForm.getInputProps("city")}
					/>
					<NumberInput
						label="Max players"
						defaultValue={numPlayers}
						max = {100}
						min={2}
						key={createGameForm.key("numPlayers")}
						{...createGameForm.getInputProps("numPlayers")}
					/>
					<TextInput
						label="Your name"
						key={createGameForm.key("PlayerName")}
						{...createGameForm.getInputProps("PlayerName")}
					/>
					<Radio.Group 
						label="Choose a team" 
						key={createGameForm.key("teamID")}
						{...createGameForm.getInputProps("teamID")}
					>
						<Stack pt="md" gap="xs">
							{teamCards}
						</Stack>
					</Radio.Group>
					<Button type="submit">Create and Join</Button>
					<Button variant="outline" onClick={() => navigate("/lobby/choose-match")}>Back</Button>
				</Stack>
			</form>
		</Center>
	);
	
}


