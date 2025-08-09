import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:1234"
	}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
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

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});