import { gameLocationCenters } from "@/scripts/consts";
import LocationMarker from "@/src/match/interfaces/useMyLocation";
import { Container } from "@mantine/core";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function ExampleMap() {
	return (
		<Container h="50vh">
			<APIProvider
				apiKey="AIzaSyCG6Ouy-lsuiGpNCcibChoSxW6f0zupHNc"
				libraries={["geometry"]}
				onError={(e) => console.error(e)}>
				<Map
					style={{
						height: "50vh",
						width: "100vw"
					}}
					mapId="5eaa0d345956e4f1"
					streetViewControl={false}
					fullscreenControl={false}
					mapTypeControl={false}
					defaultZoom={12}
					gestureHandling={"greedy"}
					defaultCenter={gameLocationCenters["melbourne"]}
					disableDefaultUI={true}>
						<LocationMarker initialPosition={gameLocationCenters["melbourne"]} color="red" />
				</Map>
			</APIProvider>
		</Container>
	);
}
