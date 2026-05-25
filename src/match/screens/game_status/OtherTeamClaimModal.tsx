import { ConnectFourGameState } from "@/scripts/games/connect_four/types";
import { LogMetadata } from "@/scripts/types/types";
import { ConnectFourContext, GameContext } from "@/src/match/Board";
import { ChallengeButton } from "@/src/match/screens/match_tabs/challenges/UI/ChallengePopup";
import { ChallengeEvidence, ClaimChallengeCompleted } from "@/src/match/screens/match_tabs/game_log/messages/ChallengeCompleted";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import P from "@/src/userInterface/P";
import { Box, Container, Group, Modal, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogEntry } from "boardgame.io";
import { useContext, useEffect, useRef, useState } from "react";

export default function OtherTeamClaimModal() {
    const props = useContext(GameContext);
    const G = useContext(ConnectFourContext) as ConnectFourGameState;
    const theme = useMantineTheme();
    const playerData = props.playerData.data;
    // Start at current log length so existing entries on join don't pop up.
    const lastSeenLength = useRef(props.log.length);
    const [opened, { open, close }] = useDisclosure(false);
    const [entry, setEntry] = useState<LogEntry | undefined>();

    useEffect(() => {
        if (props.log.length <= lastSeenLength.current) return;
        const newEntries = props.log.slice(lastSeenLength.current);
        lastSeenLength.current = props.log.length;
        // Most recent qualifying entry in this batch wins, so a fast burst of
        // claims still surfaces the latest one.
        const claim = [...newEntries].reverse().find(e => {
            if (e.action.payload.type !== "completeChallengeAndClaim") return false;
            const senderTeam = props.G.allPlayersData[e.action.payload.playerID]?.teamColor;
            return senderTeam && senderTeam !== playerData.teamColor;
        });
        if (claim) {
            setEntry(claim);
            open();
        }
    }, [props.log]);

    if (!entry) return null;
    const metadata = entry.metadata as LogMetadata;
    const challenge = G.challengeDeck?.find(c => c.title === metadata.challenge);
    const teamColors = theme.colors[metadata.team];
    const headerStyle = {
        background: teamColors[1],
        borderBottom: `2px solid ${teamColors[6]}`,
    };

    return (
        <Modal.Root opened={opened} onClose={close} padding={0} radius={0} centered>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header style={{ gap: 0, padding: 0, justifyContent: "flex-start", alignItems: "flex-start" }}>
                    <ComplexHeader w="100%" style={headerStyle}>
                        <Group w="100%" justify="space-between" align="flex-start" wrap="nowrap" gap="0">
                            <Box flex="1 1 30px"></Box>
                            <Box flex="1 0 auto" ta="center">
                                <h1>Neighbourhood Claimed!</h1>
                            </Box>
                            <Box flex="1 1 30px" ta="right">
                                <Modal.CloseButton size="lg" mt="5px" mr="5px" />
                            </Box>
                        </Group>
                    </ComplexHeader>
                </Modal.Header>
                <Modal.Body>
                    <Container pb="md">
                        <Stack gap="sm">
                            <P>
                                <ClaimChallengeCompleted metadata={metadata} />
                            </P>
                            {challenge ? (
                                <ChallengeButton
                                    team={metadata.team}
                                    challenge={challenge}
                                    completed={true}
                                    claimButton={false}
                                />
                            ) : null}
                            <ChallengeEvidence metadata={metadata} />
                        </Stack>
                    </Container>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}
