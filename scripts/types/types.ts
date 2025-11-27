import { UseFormReturnType } from '@mantine/form';
import { Ctx, DefaultPluginAPIs, LobbyAPI } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { LineString } from 'geojson';
import { Dispatch, JSX, ReactElement, SetStateAction } from 'react';
import { cities } from '../consts';
import { SnakeGameState } from '@/scripts/games/snake/types';
import { PolyData, LineData } from '@/scripts/types/googleMaps';
import { ConnectFourGameState } from '@/scripts/games/connect_four/types';
import { IconType } from 'react-icons/lib';
import { Challenge } from '@/scripts/games/challenge_deck/challenge_deck_types';


export type GameStateUniversal = {
	gameName: string;
	gameCode: string;
	allPlayersData: AllPlayersData;
	allTeamsData : {[key in MatchTeamString] : string[]}
	gameOver: boolean;
	startTime?: number;
	endTime?: number;
	gameStateLogs: GameStateLog<any>[]
	active: boolean;
	teamPhotoURLs: {[key in MatchTeamString] : string}
	victory?: MatchTeamColor
}

export type GameStateGeneric = ConnectFourGameState | SnakeGameState
interface GameStateEverything extends Omit<ConnectFourGameState, 'gameCode' | 'gameStateLogs'>, Omit<SnakeGameState, 'gameCode' | 'gameStateLogs'> {}

export interface GameStateAnything extends GameStateUniversal, Partial<Omit<GameStateEverything, keyof GameStateUniversal>>{}

export type MoveContext<SomeGameState extends GameStateUniversal> = DefaultPluginAPIs & { G: SomeGameState; ctx: Ctx; playerID: string };


export type GameStateLog<GameState extends GameStateUniversal> = Omit<GameState, "gameStateLogs">

export type AllPlayersData = {
	[key:string] : PlayerData
}

export type PlayerData = {
	playerID: `${number}`;
	name: string;
	teamColor: MatchTeamColor;
	playerCredentials?: string;
	matchID?: string;
	gameCode?: string;
	admin?: boolean;
}

// export type AllTeamsData = {
// 	[key in MatchTeamString] : TeamData
// }

// export type TeamData = {
// 	challengeDeck : Challenge[];
// 	challengeHand : Challenge[];
// 	challengeDiscard : Challenge[];
// }

export type zoneStatus = Color | "empty";

export interface MapData {
	zonePolygons: PolyData[];
	winningLines: LineData[];
}

export type City = typeof cities[number];

export type GameSetupDataGeneric = {
	gameName: string,
	winter: boolean
}

export interface MatchMapData extends MapData {
	city : City;
}

export type ClientSetupData = {
	playerData: {
		data: PlayerData;
		setter?: Dispatch<SetStateAction<PlayerData | undefined>>
	};
	matchID?: string;
	gameCode: string;
	credentials?: string;
	playerID: string;
}

export type StrictMatch = Omit<LobbyAPI.Match, 'gameover' | 'setupData'> & { gameover: boolean, setupData: GameSetupDataGeneric };

export type GameBoardContextSpecific<GameState> = BoardProps<GameState> & ClientSetupData

export type GameBoardContext = BoardProps<GameStateGeneric> & ClientSetupData

export type LogMetadata = {
	date?: string;
	evidence?: string[];
	challenge?: string;
	zone?: number;
	zoneName?: string;
	team: Color;
	claimType?: "lock" | "claim" | "steal";
	stealFrom?: Color;
	growth?: number
}

export type GameMeta = {
    name: string;
    code: string;
    active: boolean;
    description: string;
    color: string;
    icon: IconType;
	playerMin: number;
	playerMax: number;
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type NamedColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white"| "grey";

export type Color = RGB | RGBA | HEX | NamedColor;

export type CoordSet = {lat: number, long: number}

export function isCity(city: string) : city is City{
	return cities.includes(city as City);
	}

// type AtLeastOneColor<T extends string> = {
// 	[K in T]?: TeamData; // Values can be anything, change type as needed
// 	} & {
// 	[K in T]: TeamData;
// 	}

export type MatchTeamString = string & {__isMatchTeam: true};
export type MatchTeamColor = NamedColor & {__isMatchTeam: true};

/** Mimics the result of Object.keys(...) */
export type keysOf<o> = o extends readonly unknown[]
    ? number extends o["length"]
        ? `${number}`
        : keyof o & `${number}`
    : {
          [K in keyof o]: K extends string
              ? K
              : K extends number
              ? `${K}`
              : never
      }[keyof o]

export const keysOf = <o extends object>(o: o) => Object.keys(o) as keysOf<o>[]
export type ClaimZoneFormValues = UseFormReturnType<
	{
		zone: number;
		challenge: string;
		evidence: string;
	}, (values: { challenge: string; evidence: string; }) => {
		zone: number;
		challenge: string;
		evidence: string;
	}
>;

export type TabData = {
	 name: string;
    component: ({ active }: {
        active: string | null;
    }) => JSX.Element;
    icon: IconType;
}


export type StripContext<T> = {
	[K in keyof T]: T[K] extends (context: infer C, ...args: infer A) => infer R
		? (...args: A) => R
		: never;
};