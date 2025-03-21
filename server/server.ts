import { Server, Origins } from 'boardgame.io/server';
import { TicTacToe } from '../src/Game';

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST, "http://10.0.0.231:1234"],
});

const PORT = parseInt(process.env.PORT || "8000");
server.run(PORT, () => console.log("server running..."));