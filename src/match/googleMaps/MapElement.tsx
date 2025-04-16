import { gameLocationCenters } from "@/scripts/consts";
import { getBoundingBoxLiteral } from "@/scripts/mapsHelpers";
import { City, ZoneData } from "@/scripts/types";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Feature, Polygon } from "geojson";
import React from "react";

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
	city: City;
};

const coordsarr = [[ 144.9749977, -37.8153091 ], [ 144.9712641, -37.8075619 ], [ 144.9560292, -37.8059004 ], [ 144.955364, -37.8094435 ], [ 144.9565012, -37.8118339 ], [ 144.9514801, -37.8132918 ], [ 144.9549133, -37.821157 ], [ 144.9558789, -37.8230215 ], [ 144.9580679, -37.8219583 ], [ 144.96693, -37.8195387 ], [ 144.971715, -37.8190004 ], [ 144.9744382, -37.8194995 ], [ 144.9749977, -37.8153091 ]]
const testCoordsLatLng = coordsarr.map((coord) => {
	return {
		lat: coord[1],
		lng: coord[0]
	}
})

export function TestMapElement(props: {bbox: Feature<Polygon>, children?: React.ReactNode}) {
	return (
		<APIProvider 
		apiKey="AIzaSyCG6Ouy-lsuiGpNCcibChoSxW6f0zupHNc"
		libraries={["geometry"]}
		onError={(e) => console.error(e)}
		>
			<Map 
							mapId = "5eaa0d345956e4f1"
							streetViewControl={false}
							fullscreenControl={false}
							mapTypeControl={false}
							disableDefaultUI={true}
							defaultBounds={getBoundingBoxLiteral(props.bbox)}

			>
				{props.children}
			</Map>
		</APIProvider>

	)
}

export default function VisGlMapElement(props: MapElementProps) {
	console.log("rendering visglmapelement")
	return (
		<APIProvider 
		apiKey="AIzaSyCG6Ouy-lsuiGpNCcibChoSxW6f0zupHNc"
		libraries={["geometry"]}
		onError={(e) => console.error(e)}
		>
			<Map 
				mapId = "5eaa0d345956e4f1"
				streetViewControl={false}
				fullscreenControl={false}
				mapTypeControl={false}
				defaultCenter={gameLocationCenters[props.city]}
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




