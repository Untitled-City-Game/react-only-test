import { cities, maps } from "@/scripts/consts";
import { fetchChallenges } from "@/scripts/games/challenge_deck/fetchChallenges";
import { fetchMapData } from "@/scripts/fetchMapData";
import { City, MatchMapData } from "@/scripts/types/types";
import CreateMatchTemplate, { createGameFormConstructor, FormValues } from "@/src/lobby/CreateMatch/CreateMatchTemplate";
import StartingZonePicker from "@/src/lobby/CreateMatch/StartingZonePicker";
import { Select } from "@mantine/core";
import { useEffect, useState } from "react";

export default function CreateMatchConnectFour() {
	const teamOptions = ["red", "blue"];

	const [city, setCity] = useState<City>("london");
	const [mapData, setMapData] = useState<MatchMapData | undefined>();
	const [startingZone, setStartingZone] = useState<string>("");

	// Preload map data as soon as the city is known so the starting-zone step
	// doesn't have to wait when the player arrives at it.
	useEffect(() => {
		let cancelled = false;
		setMapData(undefined);
		fetchMapData(city).then((data) => {
			if (!cancelled) setMapData(data);
		});
		return () => { cancelled = true; };
	}, [city]);

	//Setup mantine form
	const createGameForm = createGameFormConstructor(
		{
			city: "london" as City,
			startingZone: "",
		},
		{
			city: (value: string) => cities.includes(value as City) ? null : "Invalid city",
			startingZone: (value: string) => value ? null : "Pick a starting neighbourhood",
		},
		teamOptions
	)

	const ConnectFourSetupData = async (values: FormValues) => {
		const [mapSetupData, challengeData] = await Promise.all([
			mapData ? Promise.resolve(mapData) : fetchMapData(values.city as City),
			fetchChallenges(values.city as City),
		]);
		return {
			mapSetupData,
			gameName: values.gameName,
			startingZone: values.startingZone as string,
			challengeData,
		};
	};

	return (
		<CreateMatchTemplate
			teamOptions={teamOptions}
			gameCode={"connect_four"}
			getSetupData={ConnectFourSetupData}
			createGameForm={createGameForm}
			extraSteps={[{
				label: "Start",
				fields: ["startingZone"],
				content: (
					<StartingZonePicker
						city={city}
						mapData={mapData}
						value={startingZone}
						onChange={(zone) => {
							setStartingZone(zone);
							createGameForm.setFieldValue("startingZone", zone);
						}}
						onMapDataLoaded={setMapData}
					/>
				),
			}]}
		>
			<Select
				label="Choose a city"
				placeholder="Melbourne"
				data={Object.values(maps).map(map => ({
					label: map.name,
					value: map.code
				}))}
				{...createGameForm.getInputProps("city")}
				onChange={(value) => {
					createGameForm.setFieldValue("city", value);
					if (value) setCity(value as City);
					// Selecting a different city invalidates whatever zone was previously picked
					setStartingZone("");
					createGameForm.setFieldValue("startingZone", "");
				}}
			/>
		</CreateMatchTemplate>
	);
}
