import { createServer } from 'node:http';
import * as socketIo from 'socket.io';

const httpServer = createServer()

const io = new socketIo.Server(httpServer, {
	  path: process.env.LOCATION_SERVER_PATH,
	  cors: {
		origin: [process.env.LAN_ADDRESS || false, process.env.GAME_ADDRESS || false],
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
	//console.log("someone updated the location", body);
	socket.broadcast.emit("locationUpdate", body)
  })
});

io.listen(parseInt(process.env.LOCATION_SERVER_PORT || "3000"));

