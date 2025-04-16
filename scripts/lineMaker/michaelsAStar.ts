import { ConfidentPosition } from "@/scripts/mapsHelpers";
import * as turf from "@turf/turf";
import { Feature, FeatureCollection, GeoJsonProperties, LineString, MultiPolygon, Point, Polygon } from "geojson";

//100 is baseline, go up or down as needed
const centralityFactor = 300;
const turnPenalityFactor = 100;

//one is on, zero is off
const turnPenaltyScaling = 1;

export type GeoGridProperties = {
	x: number;
	y: number;
	obstacle: boolean;
	polygon: Feature<Polygon> | undefined;
	polygonName: string;
	edgeProximity: number;
	edgeDistance: number;
}

export type CostGridPoint = {
	x: number;
	y: number;
	neighbours: {node: CostGridPoint, direction: Direction}[];
	totalCost: number;
	costFromStart: number;
	estimatedCost: number;
	obstacle: boolean;
	toll: number;
	parent: CostGridPoint | null;
	polygonName: string;
	coords : ConfidentPosition;
	edgeDistance ?: number;
	edgeProximity: number;
	directions? : Direction[];
}

enum Direction {
    UP,
	RIGHT,
	DOWN,
	LEFT,
};


export interface ConfidentPoint extends Point {
	coordinates: [number, number] | [number, number, number];
}

type lineNames = [string, string, string, ...string[]] 

export default function findAllPaths(
	polygons: Feature<Polygon>[],
	lines: lineNames[],	
	nGridCells: number,
	gridBox?: Feature<Polygon>,
	diagonals?: boolean
){
	//TODO: determine size of adjacency and ensure we fit okay
	
	//Define grid
	const geoGrid = createGeoGrid(polygons, nGridCells) as unknown as FeatureCollection<ConfidentPoint, GeoGridProperties>;
	const templateCostGrid = createPathGrid(geoGrid);
	//for each set of polygons
	const confirmedLines: Feature<LineString>[] = [];
	let start: CostGridPoint | undefined;
	let end: CostGridPoint | undefined;
	let costedGrid: CostGridPoint[] = [];
	for (let i = 0; i < lines.length; i++) {
		const results = findPath(lines[i]!, templateCostGrid, polygons);
		confirmedLines.push(results.pathFeature);
		start = results.start;
		end = results.end;
		costedGrid = results.costedGrid;
	}
	console.log("found lines", confirmedLines.length, confirmedLines)
	return {confirmedLines, start, end, costedGrid};
}

export function createGeoGrid(polygons: Feature<Polygon, GeoJsonProperties>[], nGridCells: number) {
	
	console.log("creating geogrid");
	
	//Big honking polygon with all the polygons joined up
	const bigPolygon = turf.union(turf.featureCollection(polygons)) as Feature<Polygon | MultiPolygon, GeoJsonProperties>
	console.log("found big polygon km", Math.sqrt(turf.area(bigPolygon)));
	
	//define grid of points, we use this for mapping the line back to real space later
	const cellSize = Math.sqrt(turf.area(bigPolygon)) / (nGridCells*1000); //in km
	console.log("cell size", cellSize);

	//Find the mean orientation of edges in polygons, with matching pairs at 90 degrees
	const segments = turf.lineSegment(bigPolygon);
	console.log("segments", segments.features.length);
	const bearings = segments.features.map(segment => turf.bearing(segment.geometry.coordinates[0]!, segment.geometry.coordinates[1]!));
	console.log("bearings", bearings.length, bearings[0]);
	
	//translate to 0-360 degrees
	const bearings360 = bearings.map(bearing => bearing + 180);
	console.log("bearings360", bearings360[0]);

	//get remainders of 90 degrees
	const remainders = bearings360.map(bearing => bearing % 90);
	console.log("90 degree bearings", remainders[0], remainders);

	//find mean bearing
	const meanBearing = remainders.reduce((acc, remainder) => acc + remainder, 0) / remainders.length;
	console.log("mean bearing", meanBearing);

	let geoGrid : FeatureCollection<ConfidentPoint, GeoGridProperties> = turf.pointGrid(turf.bbox(bigPolygon), cellSize, {
		//mask: bigPolygon,
	}) as FeatureCollection<ConfidentPoint, GeoGridProperties>;

	console.log("created geogrid of size", geoGrid.features.length);
	if(geoGrid.features.length === 0) throw new Error("Geogrid has no points");
	//give each point an xy value, containing polygon value
	let xtrack = geoGrid.features[0]!.geometry.coordinates[0]!;
	let xpos = 0;
	let ypos = 0;
	// const [minX, minY, maxX, maxY] = turf.bbox(bigPolygon); //as longlat coordinates
	geoGrid.features = geoGrid.features.map((point) => {
		if((point.geometry.coordinates[0] || 0) > xtrack){
			xpos = 0;
			ypos++;
			xtrack = point.geometry.coordinates[0];
		}
		point.properties = {
			x: xpos,
			y: ypos,
			obstacle: false,
			polygon: undefined,
			polygonName:  "",
			edgeDistance: 0,
			edgeProximity: 0,			
		};
		xpos++;
		return point as Feature<ConfidentPoint, GeoGridProperties>;
	})
	
	//rotate that bad boy
	geoGrid = turf.transformRotate(geoGrid, meanBearing);

	//Now we set the polygons etc
	geoGrid.features.forEach(point => {
		const polygon = polygons.find(poly => turf.booleanPointInPolygon(point, poly));
		if(!polygon) return;
		point.properties.polygon = polygon;
		point.properties.polygonName = polygon.properties?.Name || "";
	});

	geoGrid.features = geoGrid.features.filter(point => point.properties.polygon);
	//normalise edge distance to 0-1 edgeproximity for each polygon
	polygons.forEach(polygon => {
		const polygonName = polygon.properties?.Name;
		const interiorPoints = geoGrid.features.filter(point => point.properties.polygonName === polygonName);
		const maxEdgeDistance = Math.min(...interiorPoints.map(point => point.properties.edgeDistance));
		interiorPoints.forEach(point => point.properties.edgeProximity = 1- point.properties.edgeDistance / maxEdgeDistance);
	});
	return geoGrid;
}

function createPathGrid(geoGrid: FeatureCollection<ConfidentPoint, GeoGridProperties>) : CostGridPoint[] {
	let pathGrid : CostGridPoint[][] = [];
	for(let i = 0; i < geoGrid.features.length; i++){
		const point = geoGrid.features[i];
		if(!point) continue;
		const {x, y} = point.properties;
		const newnode = {
			x: x,
			y: y,
			neighbours: [],
			totalCost: 0,
			costFromStart: 0,
			estimatedCost: 0,
			obstacle: point.properties.obstacle,
			toll: 0,
			parent: null,
			polygonName: point.properties.polygonName,
			edgeProximity : point.properties.edgeProximity,
			coords: point.geometry.coordinates
		}
		if(!pathGrid[x]) {
			pathGrid[x] = [];
		}
		pathGrid[x][y] = newnode;
	}
	console.log("completed pathgrid", pathGrid);
	//find all neighbours for pathgrid nodes
	for(let x = 0; x < pathGrid.length; x++){
		if(!pathGrid[x]) continue;
		for(let y = 0; y < pathGrid[x]!.length; y++){
			if(!pathGrid[x]![y]) continue;
			const node = pathGrid[x]![y];
			const neighbours = [{node: pathGrid[x+1]?.[y], direction: Direction.RIGHT}, {node: pathGrid[x-1]?.[y], direction: Direction.LEFT}, {node: pathGrid[x]?.[y+1], direction: Direction.DOWN}, {node: pathGrid[x]?.[y-1], direction: Direction.UP}].filter(node => node.node) as {node: CostGridPoint, direction: Direction}[];
			node?.neighbours.push(...neighbours);			
		}
	}
	//flatten
	return pathGrid.flat(1);
}

function findPath(line: [string, string, string, ...string[]], templateCostGrid: CostGridPoint[], polygons: Feature<Polygon, import("geojson").GeoJsonProperties>[])  {
	//create grid with weights and obstacles
	const costedGrid : CostGridPoint[] = createCostGrid(templateCostGrid, line, polygons);

	//define start and end points
	const {start, end} : {start: CostGridPoint, end: CostGridPoint} = findStartAndEndPoints(line, costedGrid);
	
	//find best path
	const path : CostGridPoint[] = pathFinding(start, end);
	console.log("found path of length", path.length, path);
	const pathFeature : Feature<LineString> = {
		type: "Feature",
		geometry: {
			type: "LineString",
			coordinates: path.map(point => point.coords)
		},
		properties: {
			Name: line.join(" - ")
		}
	}
	return {pathFeature, start, end, costedGrid};
}


function createCostGrid(grid: CostGridPoint[], line: string[], polygons : Feature<Polygon, import("geojson").GeoJsonProperties>[]) : CostGridPoint[] {
	//filter points that are not in the line
	const costedGrid = grid.filter(node => line.includes(node.polygonName));

	//add proximity weights to each point
	//get polygons not in line
	const notInLinePolygons = polygons.filter(polygon => !line.includes(polygon.properties?.Name)); 
	//blob them up
	const notInLine = turf.union(turf.featureCollection(notInLinePolygons));
	if(!notInLine) throw new Error("Unable to create non line blob");

	const allPolygons = turf.union(turf.featureCollection(polygons));
	if(!allPolygons) throw new Error("Unable to create all polygons blob");

	const friendlyPolygons = polygons.filter(polygon => line.includes(polygon.properties?.Name));
	const friendlyBlob = turf.union(turf.featureCollection(friendlyPolygons));
	if(!friendlyBlob) throw new Error("Unable to create friendly blob");

	const allPolygonsFat = turf.buffer(allPolygons, 10);
	if(!allPolygonsFat) throw new Error("Unable to create fat blob");

	const obstacleZone = turf.difference(turf.featureCollection([allPolygonsFat, friendlyBlob]));
	if(!obstacleZone) throw new Error("Unable to create obstacle zone");

	//

	let maxDistance = 0;
	costedGrid.forEach(node => {
		// node.toll = 1 + node.edgeProximity * centralityFactor/100;
		const distance = turf.pointToPolygonDistance(node.coords, obstacleZone);
		if(distance > maxDistance) { maxDistance = distance;}
		node.edgeDistance = distance;
	});
	//normalize edge distance to 0-1 edgeproximity
	costedGrid.forEach(node => {
		node.edgeProximity = node.edgeDistance ? 1- node.edgeDistance / maxDistance : 0;
		node.toll = 1 + node.edgeProximity * centralityFactor/100;
	});
	//trim neighbours of removed points
	costedGrid.forEach(node => {
		node.neighbours = node.neighbours.filter(neighbour => costedGrid.includes(neighbour.node));
	});
	console.log("created costedgrid", costedGrid)
	return costedGrid;
}

function findStartAndEndPoints(line: [string, string, string, ...string[]], grid: CostGridPoint[]) : {start: CostGridPoint, end: CostGridPoint} {
	//get points inside first polygon
	const startPoint = lowestEdgeProximity(grid, line[0]);
	const endPoint = lowestEdgeProximity(grid, line[line.length - 1]!);
	console.log("found start and end points", startPoint, endPoint)
	return {start: startPoint, end: endPoint};
}

function lowestEdgeProximity(grid: CostGridPoint[], polygonName: string) : CostGridPoint {
	const polygonNodes = grid.filter(node => node.polygonName === polygonName);
	console.log("lowest edge finding for", polygonName, polygonNodes.length, "possible nodes");
	return polygonNodes.reduce((acc, node) => {
		if(node.edgeProximity < acc?.edgeProximity) return node;
		return acc;
	}, polygonNodes[0]!);
}

function pathFinding(start: CostGridPoint, end: CostGridPoint) : CostGridPoint[] {
	const openList : CostGridPoint[] = [start];
	const closedList : CostGridPoint[] = [];
	const Heuristic = ManhattanDistance; //TODO: See if hoisting this is faster (or be clever and cache it for all lines)
	while (openList.length > 0) {
		//find lowest f(n) value
		let lowestFNi = 0;
		for(let i = 1; i < openList.length; i++){
			if((openList[i]?.totalCost ?? Infinity) < (openList[lowestFNi]?.totalCost ?? Infinity)){
				lowestFNi = i;
			}
		}
		const currentNode = openList[lowestFNi]!;
		
		if(currentNode === end){
			let path : CostGridPoint[] = [];
			console.log("reached the end!", currentNode);
			return buildPath(path, currentNode);
		}

		openList.splice(lowestFNi, 1);
		closedList.push(currentNode);

		//for each neighbour of current node
		for(let i = 0; i < currentNode.neighbours.length; i++){
			const neighbour = currentNode.neighbours[i]?.node;
			if(!neighbour) continue;
			if(neighbour.obstacle) continue;
			if(closedList.includes(neighbour)) continue;
			
			const priorDirection = currentNode.directions && currentNode.directions[currentNode.directions.length - 1];
			const direction = currentNode.neighbours[i]!.direction;
			const turning = priorDirection && direction !== priorDirection ? 1 : 0;
			if(turning > 0) console.log("turning", turning, priorDirection, direction);
			let neighbourCostThisPath = currentNode.costFromStart + neighbour.toll + turning*(turnPenalityFactor/100)*(currentNode.directions?.length ?? 0)*turnPenaltyScaling; //penalise extra turns more
			if(!neighbour.estimatedCost){
				neighbour.estimatedCost = Heuristic(neighbour, end);
				openList.push(neighbour);
			} if (neighbourCostThisPath < neighbour.costFromStart || neighbour.parent === null) {
				neighbour.parent = currentNode;
				neighbour.costFromStart = neighbourCostThisPath;
				if(!neighbour.directions) neighbour.directions = [];
				neighbour.directions.push(direction);
				neighbour.totalCost = neighbourCostThisPath + neighbour.estimatedCost; //TODO: Seems like we can combine h and g here to save a few calculations
			}
		}
	}
	console.warn("couldn't find any suitable lines")
	return [];
}

function ManhattanDistance(point1: CostGridPoint, point2: CostGridPoint): number {
	return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function buildPath(path: CostGridPoint[], nextNode: CostGridPoint) : CostGridPoint[] {
	path.push(nextNode);
	return nextNode.parent ? buildPath(path, nextNode.parent) : path;
}