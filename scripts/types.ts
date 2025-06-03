import { LobbyAPI } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';
import { LineString } from 'geojson';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { cities } from './consts';

//Google maps
export type geospatialFeature = {
	featureName : string,
	coords: { lat: number; lng: number; }[]
};

export interface PolyData extends geospatialFeature {
	matchedLines : LineData[]
	matchedLineElements?: ReactElement[]
}

export interface LineData extends geospatialFeature {
	matchedPolygons : string[]
}

export interface LineFeature extends GeoJSON.Feature {
			geometry: LineString;
			properties: GeoJSON.GeoJsonProperties & {Name: string};
		}
export interface PolygonFeature extends GeoJSON.Feature {
		geometry: GeoJSON.Polygon;
		properties: GeoJSON.GeoJsonProperties & {Name: string};
	}

//Game state
export interface GameState {
	zoneData: ZoneData[],
	MatchMapData: MatchMapData,
	active: boolean,
	allPlayersData : AllPlayersData,
	allTeamsData : AllTeamsData,
	gameOver : boolean,
	startTime? : number,
	endTime? : number,
}

export type ZoneData = {
	id: number;
	status: zoneStatus;
	name: string;
	controlTeam: Color | null;
}

export type AllPlayersData = {
	[key:string] : PlayerData
}

export type PlayerData = {
	playerID: `${number}`;
	name: string;
	teamColor: MatchTeamColor;
	playerCredentials?: string;
	matchID?: string;
}

export type AllChallengeData = Challenge[]

export type Challenge = {
	title: string,
	description: string,
}

export type AllTeamsData = {
	[key in MatchTeamString] : TeamData
}

export type TeamData = {
	challengeDeck : Challenge[];
	challengeHand : Challenge[];
	challengeDiscard : Challenge[];
}

export type zoneStatus = Color | "empty";

export interface MapData {
	zonePolygons: PolyData[];
	winningLines: LineData[];
}

export type City = typeof cities[number];

export interface MatchMapData extends MapData {
	city : City;
}

export type ConnectFourSetupData = {
	city : City;
}

export type ClientSetupData = {
	playerData: {
		data: PlayerData;
		setter: Dispatch<SetStateAction<PlayerData | undefined>>
	};
	matchID: string;
	gameCode: string;
	playerID : `${number}`;
	credentials?: string;
}

export type StrictMatch = Omit<LobbyAPI.Match, 'gameover' | 'setupData'> & { gameover: boolean, setupData: MatchMapData };


export type MetroGameBoardProps = MetroGameContext & {
	children?: React.ReactNode;
}

export type MetroGameContext = BoardProps<GameState> & ClientSetupData

export type LogMetadata = {
	date?: string;
	evidence?: string;
	challenge?: string;
	zone?: number;
	zoneName?: string;
	team: Color;
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type NamedColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white"| "grey";

export type Color = RGB | RGBA | HEX | NamedColor;

export function isCity(city: string) : city is City{
	return cities.includes(city as City);
	}

type AtLeastOneColor<T extends string> = {
	[K in T]?: TeamData; // Values can be anything, change type as needed
	} & {
	[K in T]: TeamData;
	}

type MatchTeamString = string & {__isMatchTeam: true};
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


