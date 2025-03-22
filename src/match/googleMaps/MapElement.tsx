import { gameLocationCenter } from "@/scripts/consts";
import { ZoneData } from "@/scripts/types";
import LocationMarker from "@/src/match/googleMaps/location";
import { Library } from "@googlemaps/js-api-loader";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const libraries: Library[] = ["places", "geometry"];

type MapElementProps = {
	setLineVisibility: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	setHighlightedZones: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	setCurrentZone: React.Dispatch<React.SetStateAction<ZoneData | undefined>>;
	lineElements: React.ReactNode;
	zoneElements: React.ReactNode;
};

export default function MapElement(props: MapElementProps) {
	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: "AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA",
		libraries: libraries,
		mapIds: ["fc1cd512863f2ee3"],
	});
	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={gameLocationCenter}
			zoom={12}
			options={{
				mapId: "fc1cd512863f2ee3",
				streetViewControl: false,
				fullscreenControl: false,
				mapTypeControl: false,
			}}
			onClick={() => {
				props.setCurrentZone(undefined);
				props.setLineVisibility({});
				props.setHighlightedZones({});
			}}>
			{/* This does the montreal grid */}
			{props.zoneElements}
			<>{props.lineElements}</>
			{/* This is the location marker */}
			<LocationMarker initialPosition={gameLocationCenter} />
		</GoogleMap>
	) : (
		<>Loading...</>
	);
}

export function VisGlMapElement() {
	return (
		<APIProvider 
		apiKey="AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA"
		libraries={["geometry"]}
		onError={(e) => console.error(e)}
		>
			<Map 
			mapId = "fc1cd512863f2ee3"
			streetViewControl={false}
			fullscreenControl={false}
			mapTypeControl={false}
			style={{ width: "100vw", height: "100vh" }}
			defaultCenter={gameLocationCenter}
			defaultZoom={12}
			gestureHandling={'greedy'}
			disableDefaultUI={true}
	  
			/>
		</APIProvider>
	);
}
//Styles to make map appear
const containerStyle = {
	width: "100%",
	height: "100%",
};
