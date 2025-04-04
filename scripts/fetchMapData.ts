import makeLines from "@/scripts/geojson/makeLines";
import makePolygons from "@/scripts/geojson/makePolygons";
import { promises as fs } from 'fs';
import { City, GameSetupData, LineData, PolyData } from "./types";

export async function fetchMapData(cityName: City = "melbourne") : Promise<GameSetupData> {
  let zoneDataObj : GeoJSON.FeatureCollection;
  try{
    const zoneData = await fs.readFile(process.cwd() + `/data/${cityName}.geojson`, 'utf8');
    zoneDataObj = JSON.parse(zoneData);
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
  const zoneLines: LineData[] = makeLines(zoneDataObj);
  const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
  return {
    zonePolygons: zonePolygons,
    winningLines: zoneLines,
    city: cityName,
  };
}
  