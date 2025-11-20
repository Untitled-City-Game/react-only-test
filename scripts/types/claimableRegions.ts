import { ZoneData } from "@/scripts/games/connect_four/types";
import { PolyData } from "@/scripts/types/googleMaps";
import { City, GameStateUniversal } from "@/scripts/types/types";

export interface ClaimableRegionsGameState extends GameStateUniversal {
	city: City;
	zoneData: ZoneData[],
	zonePolygons: PolyData[]
}