// App.tsx
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { TicTacToe } from './Game';
import { MyGameBoard } from './Board';

const TicTacToeClient  = Client({
  game : TicTacToe,
  board: MyGameBoard,
  debug: {
	collapseOnLoad: true
  },
  multiplayer: SocketIO({ server: '10.0.0.231:8000' }),


});

const App = () => (
	<div>
	  <TicTacToeClient playerID="0" />
	  <TicTacToeClient playerID="1" />
	</div>
  );
  
export default App;
