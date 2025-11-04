import { SnakeTeam } from "@/scripts/games/snake/types";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";
import { Polyline } from "@/src/match/googleMaps/shapes/PolyLine";
import { bezierSpline, buffer, lineOffset, lineString } from "@turf/turf";
import { Feature } from "geojson";

export default function SnakeBody({teamData} : {teamData : SnakeTeam}){
	const SnakeBodyPolygon = bufferedPolygon(teamData.snakeBody.segments, 30);
	if(SnakeBodyPolygon){
		return(
			<Polygon 
				paths={SnakeBodyPolygon}
				fillColor="green"
				strokeColor="darkgreen"
			/>
		)
	}
}

function bufferedPolygon(  
path: google.maps.LatLngLiteral[],
  thicknessMeters: number
): google.maps.LatLngLiteral[] | undefined {
	 if (path.length < 2) {
    return undefined
  }
  const bufferedPolygon = buffer(lineString(path.map(point => [point.lng, point.lat])), 30, {units: "meters"}) as Feature<GeoJSON.Polygon>
  return bufferedPolygon?.geometry.coordinates.flat().map(point => {return {lat: point[1], lng: point[0]}})
}

function lineToPolygon(
  path: google.maps.LatLngLiteral[],
  thicknessMeters: number
): google.maps.LatLngLiteral[] | undefined {
  if (path.length < 2) {
    return undefined
  }

  const half = thicknessMeters / 2;
  
  const leftPoints = lineOffset(lineString(path.map(point => [point.lng, point.lat])), half, {units: "meters"})
  const rightPoints = lineOffset(lineString(path.map(point => [point.lng, point.lat])), -half, {units: "meters"}).geometry.coordinates

  const leftPointsSplines = bezierSpline(leftPoints)

  const pointList = [...leftPointsSplines.geometry.coordinates, ...rightPoints.reverse()]

  const points = pointList.map(point => {return {lat: point[1], lng: point[0]}}) as google.maps.LatLngLiteral[]

  // Build polygon path: left side + reversed right side
  return points;
}
