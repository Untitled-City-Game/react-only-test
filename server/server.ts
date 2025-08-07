import { ConnectFour } from '@/scripts/games/connect_four/connect_four';
import { FlatFile, Origins, Server } from 'boardgame.io/server';

const authenticateCredentials = async () => {
 return true;
}

async function buildServer(){
	console.log("building server", process.env.GAME_ADDRESS, process.env.GAME_SERVER);
	const server = Server({
		games: [ConnectFour],
		authenticateCredentials,
		origins: [Origins.LOCALHOST,  process.env.GAME_ADDRESS || false],
		db: new FlatFile({
			dir: 'server/db'
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
	const PORT = parseInt(process.env.PORT || "8080");
	server.run(PORT, () => console.log("server running..."));
}

buildServer();