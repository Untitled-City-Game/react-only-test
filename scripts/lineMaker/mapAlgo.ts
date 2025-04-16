import * as turf from '@turf/turf';
  
  import findAllPaths, { createGeoGrid } from '@/scripts/lineMaker/michaelsAStar';
import { ShortestPath } from "@/scripts/lineMaker/shortestPath";
import { renderProgressBar } from '@/scripts/logging';
import montreal from '@data/montreal.ts';
import {
	Feature,
	FeatureCollection,
	GeoJsonProperties,
	LineString,
	Point,
	Polygon
} from "geojson";
  /** Find best ordering of named polygons that minimizes total turn angle and avoids others */
  export function findBestPolyline(
	polygonNames: string[],
	allPolygons: FeatureCollection<Polygon>
  ) {
	//Polygons which will house the string
	const polygonMap: Record<string, Feature<Polygon>> = {};
	allPolygons.features.forEach((feature) => {
	  const name = feature.properties?.Name;
	  if (name) polygonMap[name] = feature;
	});

	console.log("polygon map", polygonMap);
  
	const includedPolygons = polygonNames.map(name => {
		const poly = polygonMap[name];
		if (!poly) throw new Error(`Polygon ${name} not found`);
		return poly;
	});
	const excludedPolygons = allPolygons.features.filter(
		poly => !polygonNames.includes(poly.properties?.Name)
		);

	console.log("included polygons", includedPolygons);
	console.log("excluded polygons", excludedPolygons);
	//find the smallest cross-section of a polygon
	const smallestWaist = findSmallestWaist(includedPolygons);
	const gridSize = smallestWaist;
	console.log("grid size", gridSize);
	const excludedPolygonsFat = excludedPolygons.map(poly => {
		return turf.buffer(poly, gridSize/10) as Feature<Polygon>;
	});
	//generate a set of 10 points equally distributed within each polygon
	const polygonData = includedPolygons.map((polygon) => {
		const terminals = createTerminals(polygon, gridSize);
		return {polygon, terminals};
	});

	//find the shortest path between the end polygons
	const startTerminals = polygonData[0].terminals;
	const endTerminals = polygonData[polygonData.length - 1].terminals;
	const bestPath = findBestPath(startTerminals, endTerminals, excludedPolygonsFat, 50);
	console.log("shortest path", bestPath);

	// return bestPath
	return {shortestPath: bestPath, polygonData};
  }

function findSmallestWaist(polygons: Feature<Polygon>[]): number {
	let smallestWaist = Infinity;
	console.log("finding smallest waist");
	console.log("polygons", polygons);
	for (let i = 0; i < polygons.length; i++) {
		const polygon = polygons[i];
		console.log("finding waist of polygon", polygon);
		const turfpoly = turf.polygon(polygon.geometry.coordinates);
		const centroid = turf.centroid(turfpoly);
		const waist = turf.pointToLineDistance(centroid, turf.polygonToLine(polygon) as Feature<LineString>);
		if (waist < smallestWaist) {
			console.log("small waist found", polygon.properties?.Name, waist);
			smallestWaist = waist;
		}
	}
	return smallestWaist;
}

function createTerminals(polygon: Feature<Polygon>, gridSize: number): FeatureCollection<Point, GeoJsonProperties>
{
	const insetPolygon = turf.buffer(polygon, -gridSize);
	if(!insetPolygon){
		throw new Error("Unable to create inset polygon");
	}
	//create set of points equally distributed within inset polygon
	const bbox = turf.bbox(insetPolygon);
	const points = turf.pointGrid(bbox, gridSize*2, {mask: insetPolygon});
	//remove points that are outside the polygon
	points.features = points.features.filter((point) => {
		return turf.booleanPointInPolygon(point, insetPolygon);
	});
	console.log("terminals", points.features.length);
	return points;
}

function findBestPath(startPoints: FeatureCollection<Point, GeoJsonProperties>, endPoints: FeatureCollection<Point, GeoJsonProperties>, avoidPolygons: Feature<Polygon>[], gridSize: number) {
	//create featurecollection from polygons
	console.log("finding shortest path");
	const avoidPolygonsFC = turf.featureCollection(avoidPolygons);
	console.log("avoid polygons", avoidPolygonsFC.features.length, avoidPolygonsFC.features[0].properties?.Name);
	//for each pair of start and end points, find the shortest path between them
	const allPairs = startPoints.features.flatMap((startPoint) => {
		return endPoints.features.map((endPoint) => {
			return [startPoint, endPoint];
		});
	});
	console.log("all pairs", allPairs.length, allPairs[0][0].geometry.coordinates);

	console.log("all unique pairs", allPairs.length, allPairs[0]);
	const allPaths = allPairs.map(({0: startPoint, 1: endPoint}, index) => {
		renderProgressBar('finding shortest path', index, allPairs.length);
		return ShortestPath(startPoint, endPoint, {obstacles: avoidPolygonsFC, resolution: gridSize});
	});
	console.log("found paths", allPaths.length, allPaths[0]);
	//find the shortest path
	const shortestPath = allPaths.sort((a, b) => a.geometry.coordinates.length - b.geometry.coordinates.length)[0];
	console.log("shortest path", turf.length(shortestPath));
	console.log("longest path", turf.length(allPaths[allPaths.length - 1]));
	return shortestPath;
}

const montrealGeojson = montreal as FeatureCollection<Polygon>;
const testGeoGrid = () => createGeoGrid(montrealGeojson.features, 20);
const testFindLines = () => findAllPaths(montrealGeojson.features, [["Westmount", "Downtown", "Le Plateau", "Hochelaga"]], 30);
export function bestLine(){
	return findBestPolyline(
		["Westmount", "Downtown", "Old Port", "Hochelaga"],
		montrealGeojson
	  );
}

export { montrealGeojson, testFindLines, testGeoGrid };

