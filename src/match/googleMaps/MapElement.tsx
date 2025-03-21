import { gameLocationCenter } from "@/scripts/consts";
import { ZoneData } from "@/scripts/types";
import LocationMarker from "@/src/match/googleMaps/location";
import { GoogleMap } from "@react-google-maps/api";

type MapElementProps = {
	setLineVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	setHighlightedZones: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	setCurrentZone: React.Dispatch<React.SetStateAction<ZoneData | undefined>>;
	lineElements: React.ReactNode;
	zoneElements: React.ReactNode;
};

export default function MapElement(props : MapElementProps) {
	return (
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
	);
}
//Styles to make map appear
const containerStyle = {
	width: "100%",
	height: "100%",
};
