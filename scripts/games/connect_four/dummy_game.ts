import { Ctx, Game } from "boardgame.io";

export type DummyGameState = {
	foo: boolean,
	bar: string
}

export type DummySetupData = {
	bar: string
}

// export const DummyGame: Game<DummyGameState> = {
// 	name: `dummy_game`,
// 	setup: ({ ctx }) => {return {foo: true, bar: "bebebe"}},
// }

function DummyGameSetup(ctx: Ctx, setupData: DummySetupData){
	return {
		foo: true,
		bar: setupData.bar
	}
}