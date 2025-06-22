import { gameTimeMinutes } from "@/scripts/consts";
import {
	AllChallengeData,
	AllPlayersData,
	AllTeamsData,
	Challenge,
	GameSetupData,
	GameState,
	LogMetadata,
	MatchTeamColor,
	PlayerData,
	PolyData,
	ZoneData
} from "@/scripts/types";
import type { Ctx, DefaultPluginAPIs, Game } from "boardgame.io";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
import challengeDataGeneric from 'data/challenges/challenges_generic.json';
import challengeDataMelbourne from 'data/challenges/challenges_melbourne.json';
import { remove } from "lodash";
const challengeDataMontreal : AllChallengeData = []
const challengeDataLondon : AllChallengeData = []

type MoveContext = DefaultPluginAPIs & { G: GameState; ctx: Ctx; playerID: string };

const handSize = 5;

function addLogMetadata({ log }: { log: LogAPI }, metadata: LogMetadata) {
	log.setMetadata({ ...metadata, date: new Date().toString() });
}

function completeChallengeAndClaim(
	context: MoveContext,
	zoneID: number,
	challenge: string,
	evidence: string
) {
	const { G, log, playerID } = context;
	completeChallenge({ G, log, playerID }, challenge, evidence);
	const challengeInfo = G.challengeDeck.find(challengeInfo => challengeInfo.title === challenge);
	if(challengeInfo === undefined){
		throw new Error(`Challenge ${challenge} not found`);
	}
	console.log("complete challenge and claim move found challenge ", challengeInfo);
	claimZone({ G, log, playerID}, zoneID, challengeInfo);
	drawToFull(context);
	addLogMetadata(
		{ log },
		{
			zone: zoneID,
			zoneName: G.zoneData[zoneID].name,
			team: G.allPlayersData[playerID].teamColor,
			challenge: challengeInfo.title,
			evidence,
		}
	);
}

function claimZone(
	{ G, log, playerID }: { G: GameState; log: LogAPI; playerID: string },
	zoneID: number,
	challenge: Challenge
) {
	const claimedZone = G.zoneData[zoneID];
	console.log("claiming zone", challenge);
	//regular claim
	if(!challenge.hard && claimedZone.controlTeam === null){
		console.log("regular claim")
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		addLogMetadata({log}, {zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title});
	}

	//hard claim to lock
	else if(challenge.hard && claimedZone.controlTeam === null){
		console.log("locking claim")
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		claimedZone.locked = true;
		addLogMetadata({log}, {zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title, claimType: "lock"});
	}

	//steal
	else if(challenge.hard && claimedZone.controlTeam !== null){
		console.log("stealing claim")
		const oldTeam = claimedZone.controlTeam;
		claimedZone.controlTeam = G.allPlayersData[playerID].teamColor;
		claimedZone.locked = true;
		addLogMetadata({log}, {zone: zoneID, team: claimedZone.controlTeam, challenge: challenge.title, claimType: "steal", stealFrom: oldTeam});
	}

	//illegal claim
	else if(!challenge.hard && claimedZone.controlTeam !== null){
		console.log("invalid claim")
		return "INVALID_MOVE";
	}
}


function completeChallenge(
	{ G, log, playerID }: { G: GameState; log: LogAPI; playerID: string },
	challenge: string,
	evidence: string
) {
	discardChallenge({ G, log, playerID }, challenge);
	addLogMetadata(
		{ log },
		{
			challenge,
			evidence,
			team: G.allPlayersData[playerID].teamColor,
		}
	);
}

function discardChallenge(
	{ G, playerID }: { G: GameState; log: LogAPI; playerID: string },
	challenge: string
) {
	const team = G.allPlayersData[playerID].teamColor;
	//remove challenge from challenge hand
	const teamData = G.allTeamsData[team];
	const removedChallenge = remove(
		teamData.challengeHand,
		(challengeInHand) => challengeInHand.title === challenge
	);
	teamData.challengeDiscard.concat(removedChallenge);
}

function discardHand(context: MoveContext) {
	const { G, log, playerID } = context;
	const team = G.allPlayersData[playerID].teamColor;
	const teamData = G.allTeamsData[team];
	teamData.challengeDiscard.concat(teamData.challengeHand);
	teamData.challengeHand = [];
	drawToFull(context);
}

function drawChallenge({ G, playerID }: { G: GameState; playerID: string }) {
	//draw a challenge from deck
	const teamData = G.allTeamsData[G.allPlayersData[playerID].teamColor];
	const drawnChallenge = teamData.challengeDeck.pop();
	if (drawnChallenge) {
		teamData.challengeHand.push(drawnChallenge);
		console.log("drawn challenge", drawnChallenge.title);
	} else {
		console.log("no cards left in deck");
		//TODO: add error message
	}
}

function drawToFull({ G, playerID}: MoveContext, team?: MatchTeamColor) {
	let i = 0;
	const teamData = team ? G.allTeamsData[team] : G.allTeamsData[G.allPlayersData[playerID].teamColor];
	while (teamData.challengeHand.length < handSize) {
		drawChallenge({ G, playerID });
		i++;
		if (i > handSize) {
			console.log("error: couldn't draw to full");
			break;
		}
	}
}

function playerSetup(
	{ G, playerID, log }: { G: GameState; playerID: string; log: LogAPI },
	newPlayerData: PlayerData
) {
	G.allPlayersData[playerID] = newPlayerData;
	//check if team color is already set up
	G.allTeamsData[newPlayerData.teamColor]
	if(!G.allTeamsData[newPlayerData.teamColor]){
		console.log("adding team data for", newPlayerData.teamColor);
		G.allTeamsData[newPlayerData.teamColor] = {
			challengeDeck: [],
			challengeHand: [],
			challengeDiscard: [],
		}
	}
	console.log(
		"added player data for",
		playerID,
		newPlayerData,
		newPlayerData.name,
		newPlayerData.teamColor
	);
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);

}

function startGame(context: MoveContext) {
	const { events, G, random, log, ...rest } = context;
	//shuffle and create decks
	events.setActivePlayers({ all: "claim" });
	teamSetup(context);
	startGameTimer(G);

	G.active = true;
	addLogMetadata(
		{ log },
		{ team: G.allPlayersData[0].teamColor }
	);
}

function teamSetup(context: MoveContext) {
	const { G, random } = context;
	console.log("setting up teams");
	//extract team colors from players
	for (const [teamColor, team] of Object.entries(G.allTeamsData)) {
		const shuffledDeck = random.Shuffle(G.challengeDeck);
		team.challengeDeck = shuffledDeck;
		team.challengeHand = [];
		team.challengeDiscard = [];
		drawToFull(context, teamColor as MatchTeamColor);
	}
}

function startGameTimer(G: GameState) {
	const startTime = Date.now();
	G.startTime = startTime;
	G.endTime = startTime + gameTimeMinutes * 60 * 1000;
}

function endGame({ G, log }: MoveContext) {
	console.log("ending game");
	log.setMetadata("game end");
	G.gameOver = true;
	G.active = false;
}

const claimStateMoves = {
	claimZone,
	playerSetup,
	drawChallenge,
	drawToFull,
	discardChallenge,
	discardHand,
	completeChallenge,
	completeChallengeAndClaim,
	endGame,
};

export const ConnectFour: Game<GameState> = {
	name: `connect-four`,
	//set up game board using map json info
	// validateSetupData: (data) => isGameSetupData(data),
	setup: ({ ctx }, setupData : GameSetupData) => gameSetup(ctx, setupData),
	endIf: ({ G }) => {
		console.log("gameover check", G.gameOver);
		return G.gameOver ? "Game ended" : null;
	},
	onEnd: () => {
		console.log("on end");
	},
	moves: {
		claimZone,
		startGame,
		playerSetup,
	},
	turn: {
		onBegin: ({ events }) => {
			events.setActivePlayers({ all: "join" });
		},
		stages: {
			join: {
				moves: {
					playerSetup,
					startGame,
				},
			},
			claim: {
				moves: claimStateMoves,
			},
		},
	},
}

export type ClaimStateMoves = StripContext<typeof claimStateMoves>;

function isGameSetupData (data : unknown) : string | undefined {
	if(!data) return('No game setup data provided');
	if(typeof data !== 'object') return('Game setup data is not an object');
	if(!('city' in data) || typeof data.city !== 'string') return('Game setup data is missing city');
	if(!('zonePolygons' in data) || !('winningLines' in data) || !data.zonePolygons || !data.zonePolygons) return('Game setup data is missing map data');
}

function gameSetup(ctx: Ctx, setupData: GameSetupData): GameState {
	console.log("Setting up game of connect four");
	console.log("players: ", ctx.numPlayers);
	console.log("currentplayer ", ctx.currentPlayer);
	console.log("city", setupData.mapSetupData.city);
	console.log("getting map data");
	
	return {
		gameName: setupData.gameName,
		zoneData: createBoardFromMapJson(setupData.mapSetupData.zonePolygons),
		MatchMapData: setupData.mapSetupData,
		active: false,
		gameOver: false,
		allPlayersData: {} as AllPlayersData,
		//declare allteamsdata as AllTeamsData object
		allTeamsData: {} as AllTeamsData,
		challengeDeck: createChallengeDeck(setupData.mapSetupData.city)
	};
}

function createBoardFromMapJson(mapData: PolyData[]): ZoneData[] {
	return mapData.map((zone, index) => {
		return {
			id: index,
			status: "empty",
			name: zone.featureName,
			controlTeam: null,
			locked: false
		};
	});
}

type StripContext<T> = {
	[K in keyof T]: T[K] extends (context: infer C, ...args: infer A) => infer R
		? (...args: A) => R
		: never;
};

function createChallengeDeck(city: string) {
	const challengeData = challengeDataGeneric as AllChallengeData
	switch (city) {
		case "melbourne":
			return challengeData.concat(challengeDataMelbourne)
		case "montreal":
			return challengeData.concat(challengeDataMontreal)
		case "london":
			return challengeData.concat(challengeDataLondon)
		default:
			return challengeData
	}
}

