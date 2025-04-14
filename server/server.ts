import { firebaseConfig } from '@/scripts/firebase';
import { ConnectFour } from '@/scripts/games/connect_four';
import { Firestore } from 'bgio-firebase';
import { Origins, Server } from 'boardgame.io/server';

const database = new Firestore({
	app: 'outside-2d699',
	config: {
		...firebaseConfig,
		databaseURL: `https://${process.env.FIREBASE}.firebaseio.com`,
	},
  });
  

// async function fetchAllData(){
// 	const allData : Record<string, MatchMapData> = {};
// 	for (const city of cities){
// 		const mapData = await fetchMapData(city).catch(e => console.error(e));
// 		if (!mapData) continue;
// 		console.log("fetched data for city", city);
// 		allData[city] = mapData;
// 		continue;
// 	}
// 	return allData;
// }


async function buildServer(){
	console.log("building server", process.env.GAME_ADDRESS, process.env.GAME_SERVER);
	//const AllMapsData : Record<string, MatchMapData> = await fetchAllData();
	const server = Server({
		games: [ConnectFour],
		origins: [process.env.GAME_ADDRESS ==='localhost' && Origins.LOCALHOST || process.env.GAME_ADDRESS || false],
		db: database,
	});

	server.router.get('/hello', (ctx) => {
		ctx.body = 'Hello ee!';
	  });
	server.router.get('/map-data/:citycode', async (ctx) => {
		console.log("getting map data for city", ctx.params.citycode);
		const mapData = await fetch(`https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=${ctx.params.citycode}`);
		ctx.body = await mapData.text();
	  });
	const PORT = parseInt(process.env.PORT || "8080");
	server.run(PORT, () => console.log("server running..."));
}

buildServer();