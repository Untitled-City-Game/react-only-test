import { LineData } from "@/scripts/types/googleMaps";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { theme } from "@/src/styles/theme";
import { Marker } from "@vis.gl/react-google-maps";
import { Fragment } from "react";

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
	return (
		<>
			<Polyline
				path={line.coords}
				visible={lineVisibility}
				strokeColor = {color[6]}
				strokeOpacity = {1}
				strokeWeight = {8}
				clickable={false}
				
			/>
			{/* <Fragment>
				<Marker 
					position={line.coords[0]}
					visible={lineVisibility}
					clickable={false}
					zIndex={5}
					icon = {{
						strokeColor: `${theme.black}`,
						path: "M 0, 0 m 10, 0 a 10,10 0 2,0 -10,0 a 10,10 0 2,0  10, 0 ",
						fillColor: `${theme.white}`,
						fillOpacity: 1,
						strokeWeight: 2,

					}}
				/>
			</Fragment>
			<Fragment>
				<Marker 
					position={line.coords[line.coords.length -1]}
					visible={lineVisibility}
					clickable={false}
					zIndex={5}
					icon = {{
						strokeColor: `${theme.black}`,
						path: "M 0, 0 m 10, 0 a 10,10 0 1,0 -10,0 a 10,10 0 1,0  10, 0 ",
						fillColor: `${theme.white}`,
						fillOpacity: 1,
						strokeWeight: 5,

					}}
				/>
			</Fragment> */}

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
