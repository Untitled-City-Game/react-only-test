import { maps } from "@/scripts/consts";
import makeLines from "@/scripts/geojson/makeLines";
import makePolygons from "@/scripts/geojson/makePolygons";
import toGeoJson from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { City, LineData, MatchMapData, PolyData } from "./types";

export async function fetchMapData(cityName: City = "melbourne") : Promise<MatchMapData> {
  let zoneDataObj : GeoJSON.FeatureCollection;
  // try{
  // } catch (error) {
  //   throw new Error(`Error reading file: ${error}`);
  // }
  zoneDataObj = await fetchKML();
  const zoneLines: LineData[] = makeLines(zoneDataObj);
  const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
  return {
    zonePolygons: zonePolygons,
    winningLines: zoneLines,
    city: cityName,
  };
}

async function fetchKML(cityName: City = "melbourne"){
  const res = await fetch(process.env.GAME_SERVER + `/map-data/${maps[cityName].kml_live_id}`);
  //const res = await fetch(`https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=${maps[cityName].kml_live_id}`);
  console.log("res", res);
  const kmlText = await res.text();
  console.log("kml text", kmlText);
  const kmlParsed = new DOMParser().parseFromString(kmlText, "text/xml");
  console.log("parsed kml", kmlParsed);
  const geoJson = toGeoJson.kml(kmlParsed);
  if(!geoJson.features){
    throw new Error("KML file did not contain features");
  }
  return geoJson as GeoJSON.FeatureCollection;
}