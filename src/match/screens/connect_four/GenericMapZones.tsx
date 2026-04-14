import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { MatchMapData } from "@/scripts/types/types";
import { Polygon } from "@/src/match/googleMaps/shapes/Polygon";
import { defaultColor } from "@/src/styles/theme";
import { useMantineTheme } from "@mantine/core";

export function GenericMapZones({MapData, selectedZone, onClick}:{MapData : MatchMapData, selectedZone?: string, onClick: (zoneName: string)=> void}){
	const { zonePolygons } = MapData;
	const theme = useMantineTheme()
	console.log("selected zone", selectedZone)
	const zoneElements = zonePolygons?.map((zone, index) => {
			const isSelected = zone.featureName === selectedZone
			return (
				<Polygon
					paths={zone.coords}
					key={zone.featureName}
					fillColor={isSelected ? defaultColor() : "black"}
					fillOpacity={isSelected ? 0.5 : 0}
					strokeColor={isSelected ? defaultColor({shade: 8}): "black"}
					zIndex={99}
					onClick={() => onClick(zone.featureName)}
				/>
			);
		});
		return zoneElements;
	}