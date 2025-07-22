import { Button, Radio, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useNavigate, useParams } from "react-router";

import { games } from "@/scripts/consts";
import { joinMatch } from "@/scripts/joinMatch";
import { NamedColor, PlayerData } from "@/scripts/types";
import Loading from "@/src/match/boardGame/Loading";
import P from "@/src/userInterface/P";
import { useEffect, useMemo, useState } from "react";
import { ListButton } from "../userInterface/ListButton";

export default function JoinMatch() {
	const matchID = useParams().matchID;
	const gameCode = useParams().gameCode;
	if (!matchID || !gameCode) {
		throw new Error("Invalid match ID or game code");
	}
	const game = games.find((game) => game.code === gameCode);

	const lobbyClient = useMemo(
		() => new LobbyClient({ server: process.env.GAME_SERVER }),
		[]
	);

	let navigate = useNavigate();

	//get match data
	const [matchData, setMatchData] = useState<LobbyAPI.Match>();
	useEffect(() => {
		lobbyClient.getMatch("connect-four", matchID).then((res) => {
			console.timeLog("load", "got match data " + matchID);
			setMatchData(res);
		});
	}, [matchID, lobbyClient]);

	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamColor: "" as NamedColor,
		},
		validate: {
			PlayerName: (value) =>
				value.length > 0 ? null : "Player name is required",
			teamColor: (value) =>
				value.length > 0 ? null : "Team is required",
		},
	});

	type FormValues = {
		PlayerName: string;
		teamColor: NamedColor;
	};
	const handleJoinGame = async (values: FormValues) => {
		console.log(values);
		console.warn("looking for player", values.PlayerName)
		const existingPlayer = matchData?.players.find(player => player.name === values.PlayerName);
		let playerData : PlayerData
		if (existingPlayer && existingPlayer.name && existingPlayer.data.teamColor) {
			console.warn("Player already exists in the match");
			playerData = {
				playerID: `${Number(existingPlayer.id)}`,
				name: existingPlayer.name,
				matchID,
				teamColor: existingPlayer.data.teamColor,
				
			}
		} else {
			playerData = await joinMatch(
				lobbyClient,
				matchID,
				values.PlayerName,
				values.teamColor
			);
		}
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
			<ListButton
				component={Radio.Card}
				value={item.value}
				key={item.value}
				color={item.value}>
				<Radio.Indicator
					color={item.value}
					iconColor="white"
					size="lg"
				/>
				<div>
					<P>{item.label}</P>
					<P>
						{item.members?.length
							? `Members: ${item.members.join(", ")}`
							: "None"}
					</P>
				</div>
			</ListButton>
		));
		return (
			<>
				<h1>{matchData.setupData.gameName}</h1>

				<Stack gap={0} mb="sm">
					<span><strong>Host:</strong> {matchData.players[0].name}</span>
					<span><strong>Match ID:</strong> {matchID}</span>
				</Stack>
				<form
					onSubmit={joinGameForm.onSubmit(handleJoinGame)}
					id="joingame">
					<TextInput
						label="Your name"
						key={joinGameForm.key("PlayerName")}
						{...joinGameForm.getInputProps("PlayerName")}
					/>
					<P fs="italic" fz="xs">To rejoin, enter the same name you used to join the game.</P>
					<Radio.Group
						pt="md"
						label="Choose a team"
						key={joinGameForm.key("teamColor")}
						{...joinGameForm.getInputProps("teamColor")}>
						<Stack gap="xs">{teamCards}</Stack>
					</Radio.Group>
				</form>
				<Button type="submit" form="joingame">
					Join Game
				</Button>
			</>
		);
	}

	return <Loading message="Loading..." />;
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
// 								teamColor: values.teamColor
// 							}
// 						}
// 					)
// 					console.log("res" , res);
// 					const playerData : PlayerData = {
// 						name: values.PlayerName,
// 						playerID: res.playerID as `${number}`,
// 						matchID: matchID,
// 						playerCredentials: res.playerCredentials,
// 						teamColor: values.teamColor as Color,
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
