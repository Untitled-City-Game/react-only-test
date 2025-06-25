import { cities } from '@/scripts/consts';
import { ConnectFour } from '@/scripts/games/connect_four/connect_four';
import { MatchMapData } from '@/scripts/types';
import { fetchMapData } from '@scripts/fetchMapData';
import { Firestore } from 'bgio-firebase';
import { FlatFile, Origins, Server } from 'boardgame.io/server';
import admin from 'firebase-admin';

const database = new Firestore({
	config: {
		credential: admin.credential.applicationDefault(),
		databaseURL: 'https://metro-game-474bc.firebaseio.com',
	},
  });
  


async function fetchAllData(){
	const allData : Record<string, MatchMapData> = {};
	for (const city of cities){
		const mapData = await fetchMapData(city).catch(e => console.error(e));
		if (!mapData) continue;
		console.log("fetched data for city", city);
		allData[city] = mapData;
		continue;
	}
	return allData;
}


async function buildServer(){
	console.log("building server", process.env.GAME_ADDRESS, process.env.GAME_SERVER);
	//const AllMapsData : Record<string, MatchMapData> = await fetchAllData();
	const server = Server({
		games: [ConnectFour],
		origins: [Origins.LOCALHOST,  process.env.GAME_ADDRESS || false, "*"],
		db: new FlatFile({
			dir: process.cwd() + '/server/db',
		})
	});

	server.router.get('/hello', (ctx) => {
		ctx.body = 'Hello ee!';
	  });
	server.router.get('/map-data/:citycode', async (ctx) => {
		console.log("getting map data for city", ctx.params.citycode);
		const mapData = await fetch(`https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=${ctx.params.citycode}`);
		ctx.body = await mapData.text();
	  });
	const PORT = parseInt(process.env.PORT || "8000");
	server.run(PORT, () => console.log("server running..."));
}

buildServer();