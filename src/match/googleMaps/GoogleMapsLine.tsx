import { LineData } from "@/scripts/types/googleMaps";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { ZoomContext } from "@/src/match/googleMaps/VisGLMapElement";
import { theme } from "@/src/styles/theme";
import { Marker } from "@vis.gl/react-google-maps";
import { Fragment, useContext, useEffect } from "react";

export default function MapLine({
	line,
	lineVisibility = false,
	index,
}: {
	line: LineData;
	lineVisibility: boolean;
	index: number;
}) {
	const color = Object.values(theme.colors)[index]
	const zoom = useContext(ZoomContext)
	useEffect(()=> {
		console.log("zoom changed!", zoom)
	}, [zoom])
	return (
		<>
			<Polyline
				path={line.coords}
				visible={lineVisibility}
				strokeColor = {color[6]}
				strokeOpacity = {1}
				strokeWeight = {5}
				clickable={false}
				zIndex = {20}
				
			/>
			<Fragment>
				<Circle 
					center={line.coords[0]}
					radius = {70}
					fillColor = {`${theme.white}`}
					fillOpacity = {1}
					strokeColor = {"black"}
					visible={lineVisibility}
					zIndex={21}
				/>
			</Fragment>
			<Fragment>
				<Circle 
					center={line.coords[line.coords.length-1]}
					radius = {70}
					fillColor = {`${theme.white}`}
					fillOpacity = {1}
					strokeColor = {"black"}
					visible={lineVisibility}
					zIndex={21}
				/>
			</Fragment>
			

			{/* Make a circle at each vertex of the polyline */}
			{/* {line.coords.map((coord, index) => {
				return (
					<Fragment key={index}>
						<Marker 
							position={coord}
							key={"marker"+index}
							visible={lineVisibility}
							clickable={false}
							zIndex={5}
							icon = {{
								strokeColor: `${theme.black}`,
								path: "M 0, 0 m 5, 0 a 5,5 0 1,0 -10,0 a 5,5 0 1,0  10, 0 ",
								fillColor: `${theme.white}`,
								fillOpacity: 1,
								strokeWeight: 2,

							}}
						/>
					</Fragment>
				);
			})} */}
		</>
	);
}
