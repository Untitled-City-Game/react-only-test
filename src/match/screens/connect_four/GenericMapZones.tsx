import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { MatchMapData } from "@/scripts/types/types";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";

export function GenericMapZones({MapData, selectedZone, onClick}:{MapData : MatchMapData, selectedZone?: string, onClick: (zoneName: string)=> void}){
	const { zonePolygons } = MapData;
	console.log("selected zone", selectedZone)
	const zoneElements = zonePolygons?.map((zone, index) => {
			const isSelected = zone.featureName === selectedZone
			return (
				<Polygon
					paths={zone.coords}
					key={zone.featureName}
					fillColor={isSelected ? "orange" : "black"}
					fillOpacity={isSelected ? 0.5 : 0}
					strokeColor={isSelected ? "orange" : "black"}
					onClick={() => onClick(zone.featureName)}
				/>
			);
		});
		return zoneElements;
	}