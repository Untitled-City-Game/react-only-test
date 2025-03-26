import { LineData } from "@/scripts/types";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
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
				strokeColor = {"red"}
				strokeOpacity = {0.8}
				strokeWeight = {6}
			/>
			{/* Make a circle at each vertex of the polyline */}
			{line.coords.map((coord, index) => {
				return (
					<Fragment key={index}>
						<Circle
							center={coord}
							radius={0}
							visible={lineVisibility}
							key={"circle"+index}
								strokeColor= {"red"}
								strokeOpacity = {1}
								strokeWeight= {12}
								fillColor= {"red"}
								fillOpacity= {1}
						/>
						<Circle
							center={coord}
							radius={0}
							visible={lineVisibility}
							key={"innercircle"+index}
							strokeColor={"white"}
							strokeOpacity = {1}
							strokeWeight = {6}
							zIndex = {1}

						/>
					</Fragment>
				);
			})}
		</>
	);
}
