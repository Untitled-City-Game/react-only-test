import { geospatialFeature, LineData } from "@/scripts/types/googleMaps";
import { CoordSet } from "@/scripts/types/types";
import { theme } from "@/src/styles/theme";
import { bezierSpline, lineString } from "@turf/turf";
import * as turf from '@turf/turf'
// Calculate distance between two points
function distance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
	return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
}

// Check if two points are the same (within tolerance)
function pointsEqual(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }, tolerance = 0.000001): boolean {
	return distance(p1, p2) < tolerance;
}

function hasPoint(point: { lat: number; lng: number; }, coords: { lat: number; lng: number; }[]) {
	//check if point is in coords
	if (coords.find(coord => pointsEqual(coord, point))) {
		return true;
	} else {
		return false;
	}
}


export type LineOverlap = {
	lines: {
		featureName: string,
		color: string,
		reverseOffset?: boolean
	}[],
	coords: {
		lat: number;
		lng: number;
	}[]
}

const colors = Object.values(theme.colors)

type ColoredLine = geospatialFeature & { color: string }

export function processMetroLines(lines: geospatialFeature[]) {
	const colouredLines = lines.map((line, index) => {
		return {
			color: colors[index][6],
			...line
		}
	})  
	// Convert lat/lng coords to paper.js Points
	// const smoothedLines = colouredLines.map((line) => {
	// 	return {
	// 		...line,
	// 		coords: smoothCoords(line.coords)

	// 	}
	// })

	const offsetLines = [...colouredLines]

	// Track which vertices each line pair overlaps at
	const lineOverlaps: LineOverlap[] = []

	// for (let i = 0; i < offsetLines.length; i++) {
	// 	for (let j = 0; j < offsetLines.length; j++) {
	// 		const line1 = offsetLines[i]; //line to check
	// 		const line2 = offsetLines[j]; //line to check against
	// 		var currentSegment = [];

	// 		//skip checking self
	// 		if(i === j) continue;

	// 		for (let pix1 = 0; pix1 < line1.coords.length ; pix1++) { // index of point to check on line1
	// 			if (hasPoint(line1.coords[pix1], line2.coords.filter(point => point))){
	// 				console.log(`Point ${pix1} on ${line1.featureName} is also in ${line2.featureName}`)
	// 				//Add coord from line1 to current segment
	// 				currentSegment.push(line1.coords[pix1])
	// 				console.log("current segment", currentSegment)
	// 				//check and save if the line is ending
	// 				if(pix1 === line1.coords.length - 1 && currentSegment.length > 1){
	// 					console.log("end of the line, saving segment", currentSegment);
	// 					lineOverlaps.push(newOverlap([line1, line2], currentSegment));
	// 					[offsetLines[i], offsetLines[j]] = makeOffset(offsetLines[i], offsetLines[j], currentSegment);
	// 				}
	// 			} else if(currentSegment.length > 0){
	// 				if(currentSegment.length > 1){
	// 					console.warn("Pushing a new segment to the list", currentSegment, lineOverlaps)
	// 					//Add current segment to overlap list
	// 					lineOverlaps.push(newOverlap([line1, line2], currentSegment));
	// 					[offsetLines[i], offsetLines[j]] = makeOffset(offsetLines[i], offsetLines[j], currentSegment);
	// 				}
	// 				//Clear segment
	// 				console.log("clearing current segment ", currentSegment)
	// 				currentSegment = []
	// 			}
	// 		}
	// 	}
	// }

	return { offsetLines, lineOverlaps };
}

function newOverlap(lines: (geospatialFeature & { color: string })[], overlapCoords: Vec2D[]) {
	const overlap: LineOverlap = {
		lines: lines.map(line => {
			const nextpoint = hasPoint(line.coords[0], overlapCoords) ? line.coords[line.coords.length - 1] : line.coords[0]
			const reverseOffset = getSideOfLine(overlapCoords[0], overlapCoords[overlapCoords.length - 1], nextpoint)
			return {
				reverseOffset,
				...line
			}
		}),
		coords: [...overlapCoords]
	}
	return overlap;
}

export function offsetLine(line: {
	lat: number;
	lng: number;
}[], reverse: boolean = false) {
	const BASE_OFFSET = 0.0004 * (reverse ? -1 : 1);
	const spoint = line[0]
	const epoint = line[line.length - 1]
	const newPoints = findOffsetPoints(spoint, epoint, BASE_OFFSET)
	return newPoints
	// return([{lat: spoint.lat + dx, lng: spoint.lng - dy}, {lat: epoint.lat + dx, lng: epoint.lng - dy}])
}


function findOffsetPoints(A: Vec2D, B: Vec2D, distance: number): Vec2D[] {

	const p: Vec2D = {
		lat: A.lat - B.lat,
		lng: A.lng - B.lng
	};

	const n: Vec2D = {
		lat: -p.lng,
		lng: p.lat
	};

	const normLength: number = Math.sqrt((n.lat * n.lat) + (n.lng * n.lng));

	n.lat /= normLength;
	n.lng /= normLength;

	return [{
		lat: A.lat + (distance * n.lat),
		lng: A.lng + (distance * n.lng)
	}, {
		lat: B.lat + (distance * n.lat),
		lng: B.lng + (distance * n.lng)

	}]
}

function getSideOfLine(A: Vec2D, B: Vec2D, C: Vec2D): boolean {
	const crossProduct = (B.lat - A.lat) * (C.lng - A.lng) - (B.lng - A.lng) * (C.lat - A.lat);

	if (crossProduct > 0) {
		return true;
	} else if (crossProduct < 0) {
		return false;
	} else {
		return false; // Point C is on the line
	}
}

function makeOffset(line1: ColoredLine, line2: ColoredLine, overlapSegment: Vec2D[]) {
	const offsetA = offsetLine(overlapSegment);
	const offsetB = offsetLine(overlapSegment, true);

	//Try one version and see if lines intersect
	const line1A = modifyPoints(line1, overlapSegment, offsetA);
	const line2B = modifyPoints(line2, overlapSegment, offsetB);

	if (!doLinesIntersect(line1A.coords, line2B.coords)) {
		line1 = line1A;
		line2 = line2B;
		return [line1, line2]
	}
	//if not, use the other version
	line1 = modifyPoints(line1, overlapSegment, offsetB);
	line2 = modifyPoints(line2, overlapSegment, offsetA);
	return [line1, line2]
}

function modifyPoints(line: ColoredLine, overlapSegment: Vec2D[], offset: Vec2D[]): ColoredLine {
	console.log("modifying points", line, overlapSegment)
	const newCoords = line.coords.filter(point => point !== undefined).map(point => {
		const overlapIndex = overlapSegment.findIndex(overlapPoint => pointsEqual(point, overlapPoint))
		if (overlapIndex === -1) {
			return point;
		}
		return offset[overlapIndex]
	})
	return {
		color: line.color,
		featureName: line.featureName,
		coords: newCoords
	};
}

interface LatLng {
	lat: number;
	lng: number;
}

function doLinesIntersect(line1: LatLng[], line2: LatLng[]): boolean {
	// Check each segment of line1 against each segment of line2
	for (let i = 0; i < line1.length - 2; i++) {
		for (let j = 0; j < line2.length - 2; j++) {
			if (doSegmentsIntersect(line1[i], line1[i + 1], line2[j], line2[j + 1])) {
				return true;
			}
		}
	}
	return false;
}

function doSegmentsIntersect(A: LatLng, B: LatLng, C: LatLng, D: LatLng): boolean {
	// Check if line segment AB intersects with line segment CD
	const d1 = crossProduct(C, D, A);
	const d2 = crossProduct(C, D, B);
	const d3 = crossProduct(A, B, C);
	const d4 = crossProduct(A, B, D);

	// Segments intersect if the points are on opposite sides of each line
	if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
		((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
		return true;
	}

	// Check for collinear cases (segments overlap or touch at endpoints)
	if (d1 === 0 && isPointOnSegment(C, D, A)) return true;
	if (d2 === 0 && isPointOnSegment(C, D, B)) return true;
	if (d3 === 0 && isPointOnSegment(A, B, C)) return true;
	if (d4 === 0 && isPointOnSegment(A, B, D)) return true;

	return false;
}

function crossProduct(A: LatLng, B: LatLng, C: LatLng): number {
	return (B.lng - A.lng) * (C.lat - A.lat) - (B.lat - A.lat) * (C.lng - A.lng);
}

function isPointOnSegment(A: LatLng, B: LatLng, P: LatLng): boolean {
	return P.lng >= Math.min(A.lng, B.lng) && P.lng <= Math.max(A.lng, B.lng) &&
		P.lat >= Math.min(A.lat, B.lat) && P.lat <= Math.max(A.lat, B.lat);
}

interface Vec2D {
	lat: number;
	lng: number;
}
function smoothCoords(coords: Vec2D[]): Vec2D[] {
	 // Convert Vec2D format to GeoJSON coordinate format [lng, lat]
  const geoJsonCoords = coords.map(coord => [coord.lng, coord.lat]);
  
  // Create a LineString
  const line = lineString(geoJsonCoords);

  //interpolate points around the vertices
  

  let arcedCoords = [geoJsonCoords[0]]
  // Create line arcs
  for(let i=1; i< geoJsonCoords.length - 1; i++){
	const rawangle1 = turf.bearingToAzimuth(turf.bearing(geoJsonCoords[i], geoJsonCoords[i-1])+90);
	const rawangle2 = turf.bearingToAzimuth(turf.bearing(geoJsonCoords[i], geoJsonCoords[i+1]));
	const angle1 = rawangle1;
	const angle2 = rawangle2;
	
	console.log("angles", angle1, angle2)
	const angleDiff = angle1 - angle2
	const center = turf.destination(geoJsonCoords[i], -0.1, angleDiff)
	const arcPoints = turf.lineArc(center, 0.1, angle1, angle2);
	arcedCoords = arcedCoords.concat(arcPoints.geometry.coordinates);
  }
  arcedCoords.push(geoJsonCoords[geoJsonCoords.length-1])
  
  // Convert back to Vec2D format
  const smoothedCoords: Vec2D[] = arcedCoords.map(coord => ({
    lng: coord[0],
    lat: coord[1]
  }));
  
  return smoothedCoords;
}

