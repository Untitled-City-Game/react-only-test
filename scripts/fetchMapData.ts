import { maps } from "@/scripts/consts";
import makeLines from "@/scripts/geojson/makeLines";
import makePolygons from "@/scripts/geojson/makePolygons";
import toGeoJson from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { City, GameSetupData, LineData, PolyData } from "./types";

export async function fetchMapData(cityName: City = "melbourne") : Promise<GameSetupData> {
  let zoneDataObj : GeoJSON.FeatureCollection;
  try{
    zoneDataObj = await fetchKML();
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

async function fetchKML(cityName: City = "melbourne"){
  const res = await fetch(`https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=${maps[cityName].kml_live_id}`);
  const kmlText = await res.text();
  const kmlParsed = new DOMParser().parseFromString(kmlText, "text/xml");
  const geoJson = toGeoJson.kml(kmlParsed);
  if(!geoJson.features){
    throw new Error("KML file did not contain features");
  }
  return geoJson as GeoJSON.FeatureCollection;
}