import { cities, maps } from "@/scripts/consts";
import { fetchMapData } from "@/scripts/fetchMapData";
import { City, NamedColor, MatchMapData } from "@/scripts/types/types";
import CreateMatchTemplate, { createGameFormConstructor } from "@/src/lobby/CreateMatch/CreateMatchTemplate";
import { Select } from "@mantine/core";

export default function CreateMatchConnectFour() {
	const teamOptions = ["red", "blue"];

	//Setup mantine form
	const createGameForm = createGameFormConstructor(
		{
		city: "melbourne" as City,
		},
		{
		city: (city : string) => cities.includes(city as City) ? null : "Invalid city",
		}, 
		teamOptions
	)

	type FormValues = {
		PlayerName: string;
		teamColor: NamedColor;
		gameName: string;
		[key:string]: any;
	};

	const ConnectFourSetupData = async (values: FormValues) => {
		const mapSetupData: MatchMapData = await fetchMapData(values.city);
		const setupData = {
			mapSetupData,
			gameName: values.gameName
		}
		return setupData;
	};

	return (
		<CreateMatchTemplate 
			teamOptions={teamOptions}
			gameCode={"connect_four"} getSetupData={ConnectFourSetupData} 
			createGameForm={createGameForm}			
		>
		<Select label="Choose a city" placeholder="Melbourne" data={Object.values(maps).map(map => ({
			label: map.name,
			value: map.code
	}))} {...createGameForm.getInputProps("city")} />
		</CreateMatchTemplate>
	);
}