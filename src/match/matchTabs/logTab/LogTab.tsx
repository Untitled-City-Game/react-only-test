import { ClaimStateMoves } from "@/scripts/games/connect_four/connect_four";
import {
	MetroGameBoardProps,
} from "@/scripts/types";
import { GameContext } from "@/src/match/boardGame/Board";
import { Message } from "@/src/match/matchTabs/logTab/Message";
import { useAutoScrollToBottom } from "@/src/userInterface/chatScroll";
import ConfirmButton from "@/src/userInterface/ConfirmModal";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import StatusBar from "@/src/userInterface/StatusBar";
import { Box, Button, Group, ScrollAreaAutosize, Stack } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function LogTab({ active }: { active: string | null }) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const playerData = props.playerData.data;
	const [worker, setWorker] = useState<ServiceWorkerRegistration>()
	async function handleEndGame() {
		console.log("ending game");
		moves.endGame();
	}

	useEffect(() => {
		console.log("active tab changed");
		scrollToBottom();
	}, [active, props.deltalog]);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			console.log("service workers in navigator");
			navigator.serviceWorker.register(
				new URL('service-worker.js', import.meta.url),
				{ type: 'module' }
			).then(worker => setWorker(worker));
		}
	}, []);


	const containerRef = useAutoScrollToBottom<HTMLDivElement>([props.log]);
	const viewport = useRef<HTMLDivElement>(null);

	const scrollToBottom = () =>
		viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'instant' });



	return (
		<

			>
			<Box pos="sticky" top={0} style={{ zIndex: 10000 }}>
				<StatusBar />
				<ComplexHeader color={props.playerData.data.teamColor}>
					<Stack gap="0" ta="center">
						<h1>Log</h1>
						<p style={{ margin: 0 }}>
							Game will end at{" "}
							{props.G.endTime &&
								new Date(props.G.endTime).toLocaleTimeString(
									"en-US",
									{ timeStyle: "short" }
								)}
						</p>
						<Group mb="sm">
							{props.playerData.data.admin ?
								<ConfirmButton variant="outline" description="undo" action={() => props.moves.customUndo()}>
									Undo last action
								</ConfirmButton>
								: null}
							<Button onClick={handleEndGame}>End Game</Button>
							<Button onClick={() => worker && testNotifications(worker, {
								title: "Neighbourhood claimed!",
								options: {
									body: "Red team claimed Mont Royal",
									image: `${process.env.GAME_ADDRESS}icon.png`,

								}
							})}>Test Notifications</Button>
							{/* <Button onClick={scrollToBottom}>Scroll to bottom</Button> */}
						</Group>
					</Stack>
				</ComplexHeader>
			</Box>
			<ScrollAreaAutosize scrollbars="y" viewportRef={viewport} style={{
				flexGrow: 10
			}}>
				<Stack align="flex-start" pb="md" ref={containerRef} ml="md" mr="md" pt="md">
					{props.log.map((entry, index) => (
						<ErrorBoundary
							key={index}
							fallback={<span>Message failed to load.</span>}>
							<Message
								key={index}
								entry={entry}
								gameData={props.G}
								playerData={playerData}
							/>
						</ErrorBoundary>
					))}
				</Stack>
			</ScrollAreaAutosize>
		</>
	);
}


async function testNotifications(worker : ServiceWorkerRegistration, notification: {title: string, options: Record<string, any>}) {
	console.warn("testing notifications", notification.options);
	if(worker){
		worker.showNotification(notification.title, notification.options);
	} else {
		console.warn("no service worker found")
	}
}
