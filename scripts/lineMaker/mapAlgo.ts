  
  import findAllPaths, { createGeoGrid } from '@/scripts/lineMaker/michaelsAStar';
import montreal from '@data/montreal.ts';
import {
	FeatureCollection,
	Polygon
} from "geojson";

const montrealGeojson = montreal as FeatureCollection<Polygon>;
const testGeoGrid = () => createGeoGrid(montrealGeojson.features, 20);
const testFindLines = () => findAllPaths(montrealGeojson.features, [["CDN", "Outremont", "Mile End", "De Lorimer"],["Parc Molson", "De Lorimer", "Hochelaga", "Jean Drapeau"],["Westmount", "Downtown", "Le Plateau", "Hochelaga"]], 30);


export { montrealGeojson, testFindLines, testGeoGrid };

// ["Westmount", "Downtown", "Old Port", "Hochelaga"]
// ["CDN", "Outremont", "Mile End", "De Lorimer"]
// ["Parc Molson", "De Lorimer", "Hochelaga", "Jean Drapeau"]