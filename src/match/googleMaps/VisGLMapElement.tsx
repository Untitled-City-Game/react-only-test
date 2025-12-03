import { APIProvider, Map, MapProps } from "@vis.gl/react-google-maps";
import React, { createContext, useEffect, useState } from "react";

interface MapElementProps extends React.PropsWithChildren, MapProps {
	center: google.maps.LatLngLiteral
};

export const ZoomContext = createContext(12)

export default function VisGlMapElement(props: MapElementProps) {

	
	// console.log("team locations", teamLocations)
	const [zoom, setZoom] = useState(12)
	return (
		<>
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
				defaultCenter={props.center}
				defaultZoom={12}
				gestureHandling={props.gestureHandling || 'greedy'}
				disableDefaultUI={true}
				onZoomChanged={(zoomEvent) => setZoom(prevZoom => zoomEvent.map.getZoom() || prevZoom)}
				onClick={props.onClick}
			>
			{/* {
				teamLocations.map(teamLocation => {
					// console.log("rendering team location marker", teamLocation)
					return (
						<LocationMarker key={teamLocation.teamName} position={teamLocation.location} color={teamLocation.teamName} />
					)
				})
			} */}
			<ZoomContext value={zoom}>
			{props.children}
			</ZoomContext>
			{/* <>{props.zoneElements}</>
			<>{props.lineElements}</> */}
			</Map>
		</APIProvider>
		</>
	);
}

