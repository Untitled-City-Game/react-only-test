import { ConnectFour } from '@/scripts/games/connect_four/connect_four';
import { FlatFile, Origins, Server } from 'boardgame.io/server';
import express from 'express';
import { createServer } from 'node:http';
import * as socketIo from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Snake } from '@/scripts/games/snake/snake';

const authenticateCredentials = async () => {
 return true;
}

const app = express();
const location_server = createServer(app);
const io = new socketIo.Server(location_server, {
	path: "/location/"
})


async function buildServer(){
	console.log("building server", process.env.GAME_ADDRESS, process.env.GAME_SERVER);
	const server = Server({
		games: [ConnectFour, Snake],
		authenticateCredentials,
		origins: [Origins.LOCALHOST, "http://localhost:1234", process.env.GAME_ADDRESS || false],
		db: new FlatFile({
			dir: process.cwd() + '/server/db',
		}),
	});

	server.router.get('/hello', (ctx) => {
		ctx.body = `Hello! Running server for game at http://localhost:1234, ${Origins.LOCALHOST} and ${process.env.GAME_ADDRESS}`;
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