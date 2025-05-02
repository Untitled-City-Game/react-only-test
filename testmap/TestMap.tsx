import {
	montrealGeojson,
	testFindLines,
	testGeoGrid
} from "@/scripts/lineMaker/mapAlgo";
import { ConfidentPoint, CostGridPoint, GeoGridProperties } from "@/scripts/lineMaker/michaelsAStar";
import {
	ConfidentPosition,
	LineLatlongs,
	PolygonLatlongs,
	toLatLong,
} from "@/scripts/mapsHelpers";
import { TestMapElement } from "@/src/match/googleMaps/MapElement";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { AdvancedMarker, AdvancedMarkerAnchorPoint, Pin } from "@vis.gl/react-google-maps";
import type { Feature, FeatureCollection, GeoJsonProperties, LineString, Point, Polygon as PolygonType } from "geojson";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
let container = document.getElementById("app")!;
let root = createRoot(container);
root.render(
	<>
		<head>
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
		</head>
		<body>
			<TestMap />
		</body>
	</>
);

function TestMap() {
	const [polygonData, setPolygonData] = useState<{
		polygon: Feature<PolygonType, GeoJsonProperties>;
		terminals: FeatureCollection<Point, GeoJsonProperties>;
	}[]>();
	const [paths, setPaths] = useState<Feature<LineString, GeoJsonProperties>[]>();
	const [grid, setGrid] = useState<FeatureCollection<ConfidentPoint, GeoGridProperties>>();
	const [start, setStart] = useState<CostGridPoint>();
	const [end, setEnd] = useState<CostGridPoint>();
	const [costedGrid, setCostedGrid] = useState<CostGridPoint[]>();
	useEffect(() => {
		const {confirmedLines, start, end, costedGrid} = testFindLines();
		setPaths(confirmedLines);
		setStart(start);
		setEnd(end);
		setCostedGrid(costedGrid);
	}, []);

	useEffect(() => {
		const grid = testGeoGrid();
		setGrid(grid);
	}, []);

	// useEffect(() => {
	// 	const { shortestPath, polygonData } = bestLine();
	// 	if (!shortestPath) return;
	// 	if (!polygonData) return;
	// 	setPath(shortestPath);
	// 	setPolygonData(polygonData);
	// 	console.log("set best path");
	// }, []);

	const polygons = montrealGeojson.features.map((feature) => (
		<Polygon
			key={feature.properties?.Name}
			paths={PolygonLatlongs(feature)}
		/>
	));
	const gridPoints = polygonData?.flatMap((poly, i) => {
		return poly.terminals.features.map((point, j) => {
			return (
				<AdvancedMarker
					key={"terminal" + i + j}
					position={toLatLong(point.geometry.coordinates as ConfidentPosition)}
				/>
			);
		});
	});
	console.log("drawing pathlines", paths?.length);
	const pathLines = paths?.map((line, i) => {
		return (
			<Polyline
				key={"path" + i}
				path={LineLatlongs(line)}
				strokeColor={"purple"}
			/>
		);
	});
	// const geoGrid = testGeoGrid();
	// console.log("test geogrid", geoGrid);
	const testGeoGridPoints = grid?.features.map((point, i) => {
		return <GridMarker point={point} key={i}/>
	});
	const testCostedPoints = costedGrid?.map((point, i) => {
		return <CostGridMarker point={point} key={i}/>
	});
	return (
		<>
			<h1>Test Map</h1>
			<div style={mapStyles}>
				<TestMapElement bbox={montrealGeojson.features[0]!}>
					{start && <AdvancedMarker position={toLatLong(start.coords)} ><Pin background={"green"}/></AdvancedMarker>}
					{end && <AdvancedMarker position={toLatLong(end.coords)}/>}
					{/* {paths && (
						<Polyline
							key={"bestPath"}
							path={LineLatlongs(paths[0]!)}
							strokeColor={"red"}
						/>
					)} */}
					{polygons}
					{testCostedPoints}
					{pathLines}
				</TestMapElement>
			</div>
		</>
	);
}

const mapStyles: React.CSSProperties = {
	height: "90vh",
};

function GridMarker({point}: {point: Feature<ConfidentPoint, GeoGridProperties>}) {
	const [show, setShow] = useState(false);
	return (
		<AdvancedMarker
			position={toLatLong(point.geometry.coordinates)}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
		>
			<div style={{border: "1px solid black", padding: "5px", backgroundColor: "white",  display: show ? "none" : "block", borderRadius: "100%"}}></div>
			<div style={{border: "1px solid black", padding: "5px", backgroundColor: "white", width: "min-content", fontSize: "12px", display: show ? "block" : "none"}}>
			<span>
					<p>x: {point.properties.x}</p>
					<p>y: {point.properties.y}</p>
					<p>polygon: {point.properties.polygonName}</p>	
					<p>edgeDistance: {point.properties.edgeDistance}</p>
					<p>edgeProximity: {point.properties.edgeProximity}</p>
			</span>
			</div>
		</AdvancedMarker>
	);

}
function CostGridMarker({point}: {point: CostGridPoint}) {
	const [show, setShow] = useState(false);
	return (
		<AdvancedMarker
			position={toLatLong(point.coords)}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
			zIndex={10}
		>
			<div style={{border: "1px solid black", padding: "5px", backgroundColor: "orange",  display: show ? "none" : "block", borderRadius: "100%"}}></div>
			<div style={{border: "1px solid black", padding: "5px", backgroundColor: "orange", width: "min-content", fontSize: "12px", display: show ? "block" : "none"}}>
			<span>
					{/* <p>x: {point.x}</p>
					<p>y: {point.y}</p> */}
					{/* <p>polygon: {point.polygonName}</p>	 */}
					<p>edgeProximity: {point.edgeProximity}</p>
					<p>Toll: {point.toll}</p>
					<p>Centrality: {point.centrality}</p>
					{/* <div>Neighbours: {point.neighbours.map((point, i) => <p key={i}>{point.node.x + ", " + point.node.y}</p>)}</div> */}
			</span>
			</div>
		</AdvancedMarker>
	);

}
