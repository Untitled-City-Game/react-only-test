import { ChallengeDeck } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { SnakeGameState } from "@/scripts/games/snake/types";
import { GameBoardContext, GameBoardContextSpecific, GameStateGeneric, PlayerData } from "@/scripts/types/types";
import GameOver from "@/src/lobby/GameOver";
import Loading from "@/src/match/screens/game_status/Loading";
import Waiting from "@/src/match/screens/game_status/Waiting";
import TabSet from "@/src/match/screens/match_tabs/TabSet";
import Span from "@/src/userInterface/Span";
import StatusBar from "@/src/userInterface/StatusBar";
import { Box } from "@mantine/core";
import { createContext, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router";


export const GameContext = createContext({} as GameBoardContext);

export function ConnectFourBoard(props: GameBoardContextSpecific<ConnectFourGameState>){
	return Board(props)
}

export function SnakeBoard(props: GameBoardContextSpecific<SnakeGameState>){
	return Board(props)
	}

function Board(props: GameBoardContext){
	const playerID = props.playerID;
	const moves = props.moves as ConnectFourMoves
	const playerData = props.playerData;
	let navigate = useNavigate();

	useEffect(() => {
	if (playerID && props.G.allPlayersData && !props.G.allPlayersData[playerID]) {
		console.log(
			"setting up player ",
			playerID,
			playerData,
			"on client"
		);
		moves.playerSetup(playerData.data);
	}
}, [playerID, moves, playerData, props.G.allPlayersData]);

	if (props.G.gameOver) {
		return <GameOver />;
	}

	if (!playerID){
		navigate("/lobby");
	}

	if (!props.G.active) {
		// if(props.G.gameName === "connect_four_demo"){
		// 	// props.moves.startGame();
		// 	return <>
		// 	<h1>Loading demo...</h1>
		// 	<button onClick={props.moves.startGame}>Start game</button>
		// 	</>
		// }
		return (
			<GameContext.Provider value={{ ...props }}>
				<MatchContext G={props.G}>
					<Waiting />
				</MatchContext>
			</GameContext.Provider>
		);
	}

	if (playerID && !props.G.allPlayersData[playerID]) {
		return <Loading message="Looking for local player data" />;
	}

	return (
		<GameContext.Provider value={{ ...props }}>
			<ErrorBoundary fallback={<span>Something went wrong inside the board element</span>}>
				<MatchContext G={props.G}>
					<MatchGameplay G={props.G} playerData={props.playerData.data} />
				</MatchContext>
			</ErrorBoundary>
		</GameContext.Provider>
	);
}

function MatchGameplay({G, playerData}:{G: GameStateGeneric, playerData : PlayerData}){
	switch(G.gameCode){
		case "connect_four":
			return ConnectFourGameplay(G, playerData )
		case "snake":
			return SnakeGameplay(G, playerData )
	}
}
function MatchContext({G, children}:{G: GameStateGeneric, children: React.ReactNode}){
	switch(G.gameCode){
		case "connect_four":
			return <ConnectFourContextWrapper G={G}>{children}</ConnectFourContextWrapper>
		case "snake":
			return <SnakeContextWrapper G={G}>{children}</SnakeContextWrapper>
	}
}

export const SnakeContext = createContext({} as SnakeGameState);
export const ConnectFourContext= createContext({} as ConnectFourGameState);
export const ChallengeDeckContext = createContext({} as ChallengeDeck)

function ConnectFourContextWrapper({G, children} : {G:ConnectFourGameState, children: React.ReactNode}){
		return(
		<ConnectFourContext.Provider value={G}>
			<ChallengeDeckContext.Provider value={{challengeDeck: G.challengeDeck, allTeamsChallengeData: G.allTeamsChallengeData}}>
				{children}
			</ChallengeDeckContext.Provider>
		</ConnectFourContext.Provider>
	)
}


function ConnectFourGameplay(G:ConnectFourGameState, playerData : PlayerData){
	const claimedZones = G.zoneData.filter(zone => zone.controlTeam === playerData.teamColor).length
	return(
		<>
			<StatusBar>
				{claimedZones} area{claimedZones === 1 ? "" : "s"} claimed
			</StatusBar>
			<TabSet tabCodes={["challenges", "connect_four_map", "log"]} />
		</>
	)
}

function SnakeContextWrapper({G, children} : {G:SnakeGameState, children: React.ReactNode}){
		return(
		<SnakeContext.Provider value={G}>
			{children}
		</SnakeContext.Provider>

	)
}

function SnakeGameplay(G: SnakeGameState, playerData : PlayerData){
	console.log("snake game state", G, playerData)
	const snakeLength = G.snakeTeamData[playerData.teamColor]?.snakeBody.maxLength
	return(
		<>
			<StatusBar>
				Snake length: {snakeLength}m
			</StatusBar>
			<TabSet tabCodes={["snake_map", "snake_data", "log" ]} />
		</>
	)

}

// export function xBoard(props: MetroGameBoardProps) {
// 	const { children, ...boardGameContext }  = props;
// 	const { moves, playerID } = props;
// 	const playerData = props.playerData.data;
// 	let navigate = useNavigate();
// 	// const [worker, setWorker] = useState<ServiceWorkerRegistration>()
// 	// useEffect(() => {
// 	// 		if ('serviceWorker' in navigator) {
// 	// 			navigator.serviceWorker.register(
// 	// 				new URL('service-worker.js', import.meta.url),
// 	// 				{ type: 'module' }
// 	// 			).then(worker => setWorker(worker));
// 	// 		}
// 	// 	}, []);

// 	// useEffect(() => {
// 	// 	if(worker){
// 	// 		const latestUpdate = boardGameContext.log.slice(-1)[0];
// 	// 		const metadata = latestUpdate.metadata;
// 	// 		if(!metadata) return;
// 	// 		let title = ""
// 	// 		let body = ""
// 	// 		console.warn("notification effect", metadata.team, playerData.teamColor)
// 	// 		if(metadata.team === playerData.teamColor){
// 	// 			return;
// 	// 		}
// 	// 		switch (latestUpdate.action.payload.type) {
// 	// 			case "completeChallengeAndClaim":
// 	// 				title = "Neighbourhood claimed!"
// 	// 			 	body = `${metadata.team} team completed challenge ${metadata.challenge} to ${metadata.claimType || "claim"} ${metadata.zoneName || metadata.zone} ${metadata.stealFrom ? `from ${metadata.stealFrom}` : null}`
// 	// 				break;
// 	// 			case "startGame":
// 	// 				title = "The game has started!"
// 	// 				break;
// 	// 			default:
// 	// 				return;
// 	// 		}
// 	// 		worker.showNotification(title, {body});
// 	// 	}
// 	// }, [boardGameContext.G.zoneData]);
	
// 	useEffect(() => {
// 		if (playerID && !props.G.allPlayersData[playerID]) {
// 			console.log(
// 				"setting up player ",
// 				playerID,
// 				playerData,
// 				"on client"
// 			);
// 			moves.playerSetup(playerData);
// 		}
// 	}, [playerID, moves, playerData, props.G.allPlayersData]);

// 	if (props.G.gameOver) {
// 		return <GameOver />;
// 	}

// 	if (!playerID){
// 		navigate("/lobby");
// 	}

// 	if (!props.G.active) {
// 		return (
// 			<GameContext.Provider value={{ ...boardGameContext }}>
// 				{/* <Waiting /> */}
// 			</GameContext.Provider>
// 		);
// 	}

// 	if (playerID && !props.G.allPlayersData[playerID]) {
// 		return <Loading message="Looking for local player data" />;
// 	}

// 	return (
// 		<GameContext.Provider value={{ ...boardGameContext }}>
// 			<p>Player ID: {playerID}</p>
// 			<p>
// 				Team: {playerID && props.G.allPlayersData[playerID].teamColor}
// 			</p>
// 			<p>Game state: {props.G.active ? "active" : "inactive"}</p>
// 			<p>Gameover: {props.G.gameOver ? "true" : "false"}</p>
// 			<ErrorBoundary fallback={<span>Something went wrong inside the board element</span>}>
// 			{children}
// 			</ErrorBoundary>
// 		</GameContext.Provider>
// 	);
// }
