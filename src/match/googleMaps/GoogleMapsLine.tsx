import { LineData } from "@/scripts/types";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { theme } from "@/src/styles/theme";
import { Marker } from "@vis.gl/react-google-maps";
import { Fragment } from "react";

export default function MapLine({
	line,
	lineVisibility = false,
}: {
	line: LineData;
	lineVisibility: boolean;
	index: number;
}) {
	return (
		<>
			<Polyline
				path={line.coords}
				visible={lineVisibility}
				strokeColor = {theme.colors.red[0]}
				strokeOpacity = {1}
				strokeWeight = {4}
				clickable={false}
			/>
			{/* Make a circle at each vertex of the polyline */}
			{line.coords.map((coord, index) => {
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
						{/* <Circle
							center={coord}
							radius={200}
							visible={lineVisibility}
							key={"circle"+index}
							strokeColor = {"red"}
							strokeOpacity={1}
							strokeWeight = {12}
							zIndex = {2}
						/> */}
						{/* <Circle
							center={coord}
							radius={200}
							visible={lineVisibility}
							key={"innercircle"+index}
							strokeColor={"white"}
							strokeOpacity={1}
							strokeWeight = {6}
							zIndex = {3}

						/> */}
					</Fragment>
				);
			})}
		</>
	);
}
