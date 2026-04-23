import { ConnectFourMoves } from "@/scripts/games/connect_four/connect_four";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/scripts/games/shared_moves/sendChatMessage";
import { SharedMoves } from "@/scripts/games/shared_moves/sharedMoves";
import {
    GameBoardContext,
} from "@/scripts/types/types";
import { GameContext } from "@/src/match/Board";
import { Message } from "@/src/match/screens/match_tabs/game_log/Message";
import { TabAlertsContext } from "@/src/match/screens/match_tabs/TabSet";
import { useAutoScrollToBottom } from "@/src/userInterface/chatScroll";
import ConfirmButton from "@/src/userInterface/ConfirmModal";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import P from "@/src/userInterface/P";
import { ActionIcon, Avatar, Box, Group, ScrollAreaAutosize, Stack, Textarea } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { IoSend } from "react-icons/io5";

export default function LogTab({ active }: { active: string | null }) {
    const props: GameBoardContext = useContext(GameContext);
    const { setTabAlertState } = useContext(TabAlertsContext)
    const moves = props.moves as SharedMoves;
    const playerData = props.playerData.data;
    // const [worker, setWorker] = useState<ServiceWorkerRegistration>()
    async function handleEndGame() {
        console.log("ending game");
        moves.endGame();
    }

    useEffect(() => {
        if (active !== "Log") return
        console.log("log tab activated!");
        setTabAlertState(oldValues => { return { ...oldValues, "log": false } });
        scrollToBottom();
    }, [active]);

    useEffect(() => {
        console.log("New log update, setting tab alert state");
        if (active === "Log") {
            scrollToBottom()
            return;
        }
        if (props.G.allPlayersData[props.log[props.log.length - 1].action.payload.playerID].teamColor == playerData.teamColor) {
            return;
        }
        setTabAlertState(oldValues => { return { ...oldValues, "log": true } })
    }, [props.log])

    const containerRef = useAutoScrollToBottom<HTMLDivElement>([props.log]);
    const viewport = useRef<HTMLDivElement>(null);

    const scrollToBottom = () =>
        viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'instant' });

    const [draft, setDraft] = useState("");
    const canSend = draft.trim().length > 0 && draft.trim().length <= CHAT_MESSAGE_MAX_LENGTH;

    function handleSend() {
        if (!canSend) return;
        moves.sendChatMessage(draft.trim());
        setDraft("");
    }

    return (
        <>
            <ScrollAreaAutosize scrollbars="y" viewportRef={viewport} style={{
                flexGrow: 10
            }}>
                <Stack id="logs_container" align="flex-start" pb="md" ref={containerRef} m="0" w="100vw" pl="md" pr="md" pt="md" gap="sm">
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
            <Group p="sm" gap="xs" align="flex-end" wrap="nowrap">
                <Textarea
                    style={{ flexGrow: 1 }}
                    placeholder="Send a message…"
                    value={draft}
                    onChange={(e) => setDraft(e.currentTarget.value)}
                    autosize
                    minRows={1}
                    maxRows={4}
                    maxLength={CHAT_MESSAGE_MAX_LENGTH}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <ActionIcon
                    size="lg"
                    variant="filled"
                    aria-label="Send chat message"
                    disabled={!canSend}
                    onClick={handleSend}
                >
                    <IoSend />
                </ActionIcon>
            </Group>
        </>
    );
}


// async function testNotifications(worker : ServiceWorkerRegistration, notification: {title: string, options: Record<string, any>}) {
// 	console.warn("testing notifications", notification.options);
// 	if(worker){
// 		worker.showNotification(notification.title, notification.options);
// 	} else {
// 		console.warn("no service worker found")
// 	}
// }
