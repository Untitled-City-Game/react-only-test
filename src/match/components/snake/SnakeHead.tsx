import { CoordSet } from "@/scripts/types/types";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

export default function SnakeHead({position}: {position : google.maps.LatLngLiteral}){
	return(
		<>
		<Circle center={position} radius={30} strokeWeight={0} fillColor="darkgreen"/>
		</>
	)
}