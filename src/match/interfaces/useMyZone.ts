import { ZoneData } from "@/scripts/games/connect_four/types";
import { PolyData } from "@/scripts/types/googleMaps";
import { ConnectFourContext, LocationContext } from "@/src/match/Board";
import getMyZone from "@/src/match/googleMaps/getMyZone";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import { useContext, useEffect, useRef } from "react";

export default function useMyZone(zonePolygons: PolyData[], zoneData: ZoneData[]){
	const myLocation = useMyLocation();
	const myZone = getMyZone(myLocation.position, zonePolygons);
	return getZoneIndex(myZone, zoneData);
}

function getZoneIndex(myZone: PolyData | null, zoneData: ZoneData[]){
	return zoneData.find(zone => zone.name === myZone?.featureName);
}


export function useMyZoneRef(){
	console.warn("running use my zone hook");
	const zonePolygons = useContext(ConnectFourContext).MatchMapData.zonePolygons;
	const zoneData = useContext(ConnectFourContext).zoneData;
	const locationRef = useContext(LocationContext);
	const zoneRef = useRef(getZoneIndex(getMyZone(locationRef!.current.position, zonePolygons), zoneData));
	useEffect(() => {
		console.warn("running use my zone effect");
		if(!locationRef) return;
		const myZone = getMyZone(locationRef!.current.position, zonePolygons);
		zoneRef.current = getZoneIndex(myZone, zoneData);
	});
	return zoneRef;
}