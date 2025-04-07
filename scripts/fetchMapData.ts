import makeLines from "@/scripts/geojson/makeLines";
import makePolygons from "@/scripts/geojson/makePolygons";
import toGeoJson from "@tmcw/togeojson";
import { promises as fs } from 'fs';
import util from "util";
import { DOMParser } from "xmldom";
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

async function fetchKML(){
  const res = await fetch("https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1h1mLlEU1PRRbiF9eusZUplFhg7wjCaU");
  const kmlText = await res.text();
  const kmlParsed = new DOMParser().parseFromString(kmlText, "text/xml");
  const geoJson = toGeoJson.kml(kmlParsed);
  console.log(util.inspect(geoJson, {showHidden: false, depth: null, colors: true}))
}

fetchKML();