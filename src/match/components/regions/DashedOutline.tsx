import { PolyData } from "@/scripts/types/googleMaps";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { theme } from "@/src/styles/theme";

export default function DashedOutline({zone, color}: {zone : PolyData, color: string}){
	const lineSymbol : google.maps.Symbol = {
		path: "M -50 -100 L -50 100 L 0 100 L 0 -100 Z",
		strokeOpacity: 1,
		strokeColor: theme.colors[color][8],
		strokeWeight: 1,
		fillColor: theme.colors[color][8],
		fillOpacity: 1,
		scale: 0.03,

	};
	const lineBackground : google.maps.Symbol = {
		path: "M -40 -100 L -40 100 L 0 100 L 0 -100 Z",
		strokeOpacity: 1,
		strokeColor: "white",
		strokeWeight: 1,
		fillColor: "white",
		fillOpacity: 1,
		scale: 0.03,

	};
	
	const linePattern : google.maps.IconSequence[] = [
		// {
		// 	icon: lineBackground,
		// 	offset: "0",
		// 	repeat: "1px",
		// },
		{
			icon: lineSymbol,
			offset: "0",
			repeat: "10px",
		},

	]
	return (
			<Polyline zIndex={99} path={zone.coords} strokeWeight={0}  icons={linePattern} />
	)
}