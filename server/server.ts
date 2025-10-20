import { ConnectFour } from '@/scripts/games/connect_four/connect_four';
import { FlatFile, Origins, Server } from 'boardgame.io/server';
import express from 'express';
import { createServer } from 'node:http';
import * as socketIo from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Snake } from '@/scripts/games/snake/snake';
//import { DummyGame } from '@/scripts/games/connect_four/dummy_game';
const authenticateCredentials = async () => {
 return true;
}


async function buildServer(){
	console.log("building server", process.env.GAME_ADDRESS, process.env.GAME_SERVER);
	const server = Server({
		games: [ConnectFour, Snake],
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

const httpServer = createServer()
const io = new socketIo.Server(httpServer, {
	  cors: {
    	origin: [Origins.LOCALHOST,  process.env.GAME_ADDRESS || false],
   		methods: ["GET", "POST"]
 	 }
})


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on("foo", (body) => {
	console.log("someone said foo " + body);
	io.emit("foo", body)
  })
  socket.on("locationUpdate", (body) => {
	console.log("someone updated the location", body);
	socket.broadcast.emit("locationUpdate", body)
  })
});

io.listen(3000);

buildServer();