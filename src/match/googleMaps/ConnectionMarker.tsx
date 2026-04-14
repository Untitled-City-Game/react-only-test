import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { theme } from "@/src/styles/theme";

export default function ConnectionMarkers({
	point,
	index,
	lineVisibility = false,
} : {
	point: {},
	index: number,
	lineVisibility: boolean;
}){
	return (
		<>
		<Circle 
		key={index}
	center={point.originalCoord}
	radius = {70}
	fillColor = {`${theme.white}`}
	fillOpacity = {1}
	strokeColor = {"black"}
	visible={lineVisibility}
	zIndex={21}
/>
<Circle 
		key={index+0.5}
	center={point.offsetCoords[0]}
	radius = {70}
	fillColor = {`${theme.white}`}
	fillOpacity = {1}
	strokeColor = {"black"}
	visible={lineVisibility}
	zIndex={21}
/>
<Circle 
		key={index+0.7}
	center={point.offsetCoords[1]}
	radius = {70}
	fillColor = {`${theme.white}`}
	fillOpacity = {1}
	strokeColor = {"black"}
	visible={lineVisibility}
	zIndex={21}
/>
</>
	)
}