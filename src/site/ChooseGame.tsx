//Set of button links to choose game from list in consts.ts. Inactive games are marked "coming soon". Choosing a game will redirect to the choose match page.
import { games } from "@/scripts/consts";
import useWindowDimensions from "@/scripts/useWindowDimensions";
import { Container, Stack, Text } from "@mantine/core";
import { Link } from "react-router";
import { ListButton } from "../userInterface/ListButton";
import { useGeolocated } from "react-geolocated";

export default function ChooseGame() {
	const gameListItems = games.map((game, index) => {
		return (
			<ListButton
				key={index}
				component={game.active ? Link : undefined}
				to={`/lobby/${game.code}/choose-match`}
				color={game.active ? game.color : "gray"}
				>
				<game.icon color={game.active ? `var(--mantine-color-${game.color}-7` : "gray"} size={60} />
				<Container p="0">
					<h3>{game.name}</h3>
					<Text fs="italic">{game.active ? "" : "Coming soon"}</Text>
					<Text fz="sm">{game.description}</Text>
				</Container>
			</ListButton>
		);
	});

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
		return (
			<Stack
				maw="500px"
			>
				<h2>Choose a game</h2>
				<div>{isGeolocationAvailable ? "location available" : "location not available"}</div>
				<div>{isGeolocationEnabled ? "location enabled" : "location not enabled"}</div>
				{gameListItems}
				
			</Stack>
	);
}
