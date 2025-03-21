import { Button, Center, Group, Paper, Radio, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useNavigate } from "react-router";

import { joinMatch } from "@/scripts/joinMatch";
import Span from "@/src/userInterface/Span";
import { useEffect, useMemo, useState } from "react";

export default function JoinMatch({
	matchID = "default",
}: {
	matchID?: string;
}) {
	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	let navigate = useNavigate();

	//get match data
	const [matchData, setMatchData] = useState<LobbyAPI.Match>();
	useEffect(() => {
		lobbyClient.getMatch("connect-four", matchID).then((res) => {
			console.log("match data", res);
			setMatchData(res);
		});
	}, [matchID, lobbyClient]);

	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamID: "",
		},
	});

	type FormValues = {
		PlayerName: string;
		teamID: string;
	};
	const handleJoinGame = async (values: FormValues) => {
		console.log(values);
		const playerData = await joinMatch(
			lobbyClient,
			matchID,
			values.PlayerName,
			values.teamID
		);
		localStorage.setItem("localPlayerData", JSON.stringify(playerData));
		navigate("/match");
	};

	if (matchData) {
		const teamMembers = sortTeamPlayers(matchData);

		const teamOptions = [
			{ label: "Red", value: "red", members: teamMembers?.red },
			{ label: "Blue", value: "blue", members: teamMembers?.blue },
		];
		//Render radio options for teams
		const teamCards = teamOptions.map((item) => (
			<Radio.Card radius="md" value={item.value} key={item.value}>
				<Paper radius="md" p="md">
					<Group wrap="nowrap" align="center">
						<Radio.Indicator color={item.label} size="lg" />
						<div>
							<Span>{item.label}</Span>
							<Span>
								{item.members?.length
									? `Current members: ${item.members.join(
											", "
									  )}`
									: "Empty"}
							</Span>
						</div>
					</Group>
				</Paper>
			</Radio.Card>
		));
		return (
			<Center>
				<Stack>
					<h1>Join Game</h1>
					<p>Match ID: {matchID}</p>
					<form onSubmit={joinGameForm.onSubmit(handleJoinGame)}>
						<h2>Join a Game</h2>
						<TextInput
							label="Your name"
							key={joinGameForm.key("PlayerName")}
							{...joinGameForm.getInputProps("PlayerName")}
						/>
						<Radio.Group
							label="Choose a team"
							key={joinGameForm.key("teamID")}
							{...joinGameForm.getInputProps("teamID")}>
							<Stack pt="md" gap="xs">
								{teamCards}
							</Stack>
						</Radio.Group>
						<Button type="submit">Join Game</Button>
					</form>
				</Stack>
			</Center>
		);
	}

	return <Span>Loading...</Span>;
}

// 	return (
// 		<Center>
// 			<form
// 				onSubmit={joinGameForm.onSubmit(async (values) => {
// 					const { matches } = await lobbyClient.listMatches('metro-mayhem');
// 					const activeMatches = matches.filter(match => !match.gameover);
// 					let matchID = 'default';
// 					if(activeMatches.length == 0){
// 						const mapDataRes = await fetch(process.env.GAME_SERVER + "/map-data/" + 'melbourne')
// 						const mapData : GameSetupData = await mapDataRes.json();
// 						const res = await lobbyClient.createMatch('metro-mayhem', {
// 							numPlayers: 20,
// 							setupData: mapData
// 						})
// 						matchID = res.matchID;
// 						setMatchData(mapData);
// 					} else {
// 						matchID = activeMatches[0].matchID;
// 					}
// 					const res = await lobbyClient.joinMatch(
// 						'metro-mayhem',
// 						matchID,
// 						{
// 							playerName: values.PlayerName,
// 							data: {
// 								teamColor: values.teamID
// 							}
// 						}
// 					)
// 					console.log("res" , res);
// 					const playerData : PlayerData = {
// 						name: values.PlayerName,
// 						playerID: res.playerID as `${number}`,
// 						matchID: matchID,
// 						playerCredentials: res.playerCredentials,
// 						teamColor: values.teamID as Color,
// 					};
// 					setPlayerData(playerData);
// 				})}>
// 				<Stack>

// 				</Stack>
// 			</form>
// 		</Center>
// 	);
// }

function sortTeamPlayers(matchData: LobbyAPI.Match | undefined) {
	if (!matchData) {
		return undefined;
	}
	const teamsAndPlayers: Record<string, string[]> = {
		red: [],
		blue: [],
	};
	matchData.players.forEach((player) => {
		console.log("playerdata", player);
		if (
			player.name &&
			player.data &&
			typeof player.data.teamColor === "string"
		) {
			if (player.data.teamColor in teamsAndPlayers) {
				teamsAndPlayers[player.data.teamColor].push(player.name);
			} else {
				teamsAndPlayers[player.data.teamColor] = [player.name];
			}
		}
	});
	return teamsAndPlayers;
}
