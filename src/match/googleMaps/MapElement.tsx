import { gameLocationCenter } from "@/scripts/consts";
import { ZoneData } from "@/scripts/types";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

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

const coordsarr = [[ 144.9749977, -37.8153091 ], [ 144.9712641, -37.8075619 ], [ 144.9560292, -37.8059004 ], [ 144.955364, -37.8094435 ], [ 144.9565012, -37.8118339 ], [ 144.9514801, -37.8132918 ], [ 144.9549133, -37.821157 ], [ 144.9558789, -37.8230215 ], [ 144.9580679, -37.8219583 ], [ 144.96693, -37.8195387 ], [ 144.971715, -37.8190004 ], [ 144.9744382, -37.8194995 ], [ 144.9749977, -37.8153091 ]]
const testCoordsLatLng = coordsarr.map((coord) => {
	return {
		lat: coord[1],
		lng: coord[0]
	}
})

// export function MapElement(props: MapElementProps) {
// 	//Load the map
// 	const { isLoaded } = useJsApiLoader({
// 		id: "google-map-script",
// 		googleMapsApiKey: "AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA",
// 		libraries: libraries,
// 		mapIds: ["fc1cd512863f2ee3"],
// 	});
// 	return isLoaded ? (
// 		<GoogleMap
// 			mapContainerStyle={containerStyle}
// 			center={gameLocationCenter}
// 			zoom={12}
// 			options={{
// 				mapId: "fc1cd512863f2ee3",
// 				streetViewControl: false,
// 				fullscreenControl: false,
// 				mapTypeControl: false,
// 			}}
// 			onClick={() => {
// 				props.setCurrentZone(undefined);
// 				props.setLineVisibility({});
// 				props.setHighlightedZones({});
// 			}}>
// 			{/* This does the grid */}
// 			{props.zoneElements}
// 			<>{props.lineElements}</>
// 			{/* This is the location marker */}
// 			<LocationMarker initialPosition={gameLocationCenter} />
// 		</GoogleMap>
// 	) : (
// 		<>Loading...</>
// 	);
// }

export default function VisGlMapElement(props: MapElementProps) {
	console.log("rendering visglmapelement")
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
				defaultCenter={gameLocationCenter}
				defaultZoom={12}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				onClick={() => {
					props.setCurrentZone(undefined);
					props.setLineVisibility({});
					props.setHighlightedZones({});
				}}
			>
			<>{props.zoneElements}</>
			<>{props.lineElements}</>
			</Map>
		</APIProvider>
	);
}




