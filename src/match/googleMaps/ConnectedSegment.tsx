import { LineOverlap, offsetLine } from "@/src/match/googleMaps/offsets";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";

export default function ConnectedSegment({overlap, visibility} : {overlap: LineOverlap, visibility: boolean[]}){
	console.log("rendering connected segment")
	return (
				<>
				{/* <Polyline
					path={overlap.coords}
					visible={visibility[0] || visibility[1]}
					strokeColor={"white"}
					strokeOpacity={1}
					strokeWeight={40}
					clickable={false}
					zIndex={22}
				/> */}
				<Polyline
					path={offsetLine(overlap.coords, overlap.lines[1].reverseOffset)}
					visible={visibility[0] || visibility[1]}
					strokeColor={overlap.lines[1].color}
					strokeOpacity={1}
					strokeWeight={5}
					clickable={false}
					zIndex={23}
				/>
				<Polyline
					path={offsetLine(overlap.coords, overlap.lines[0].reverseOffset)}
					visible={visibility[0] || visibility[1]}
					strokeColor={overlap.lines[0].color}
					strokeOpacity={1}
					strokeWeight={5}
					clickable={false}
					zIndex={23}
				/>
				
				{/* <Circle 
					center={overlap.coords[0]}
					visible={visibility[0] && visibility[1]}
					radius = {70}
					fillOpacity = {1}
		strokeColor = {"black"}
					fillColor={"white"}
					zIndex={25}
	
				/>
				<Circle 
					center={overlap.coords[overlap.coords.length-1]}
										visible={visibility[0] && visibility[1]}
					radius = {70}
					fillColor={"white"}
						fillOpacity = {1}
		strokeColor = {"black"}
					zIndex={25}
	
				/> */}
	
				</>
			);
}