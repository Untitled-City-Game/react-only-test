import type { Game, Move } from "boardgame.io";
export interface MyGameState {
	cells: string[];
  }

const clickCell: Move<MyGameState> = ({ G, playerID }, id) => {G.cells[id] = playerID;};
  
export const TicTacToe : Game<MyGameState> = {
	setup: () => ({ cells: Array(9).fill(null) }),
  
	moves: {
	  clickCell
	},
  };