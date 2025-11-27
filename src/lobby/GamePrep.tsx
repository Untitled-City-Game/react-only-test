import { theme } from "@/src/styles/theme";
import FullHeightLayout from "@/src/userInterface/Layout";
import P from "@/src/userInterface/P";
import Segment from "@/src/userInterface/Segment";
import Span from "@/src/userInterface/Span";
import { Button, Center, Container, List, ListItem, Modal, ScrollArea, Stack, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function PrepButton() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button w="100%" onClick={open}>How to Prepare</Button>
			<PrepModal opened={opened} close={close} />
		</>
	);
}

function PrepModal({
	opened,
	close,
}: {
	opened: boolean;
	close: () => void;
}) {
	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title={
				<span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
					How to Prepare for a Playground City Game
				</span>
			}>
			<Stack>
				<P mb="sm">Before you meet up to play, here's a few suggestions to make sure the game goes smoothly!</P>
				<Segment>
					<Title order={3} size="h5">🎒 Tell everyone what to bring 🎒</Title>
					<P>Tell people this before the game day!</P>
					<List>
						<List.Item>👟 Wear sensible shoes! You'll be on the go all day.</List.Item>
						<List.Item>🎫 Get a transit day-pass, if your city has one</List.Item>
						<List.Item>🔋Come with a fully charged phone. Also a battery pack if you have one!</List.Item>
					</List>
				</Segment>
				<Segment>
					<Title order={3} size="h5">🚇 Decide what transit to use 🚇</Title>
					<P>Every city has different transit options, and every group has different preferences.</P>
					<P>Some decisions to consider:</P>
					<List>
						<List.Item>🚲 Will we use bikes or bikeshares?</List.Item>
						<List.Item>🚕 Are taxis/rideshares/personal cars allowed? (We don't recommend this for most locations)</List.Item>
						<List.Item>♿ Should we only use accessible stations?</List.Item>
					</List>
				</Segment>
				<Segment>
					<Title order={3} size="h5">🪙 Decide about money 🪙</Title>
					<P>Some challenges involve small purchases (e.g. a coffee). You can remove these when creating a game.</P>
				</Segment>
			</Stack>
		</Modal>
	);
}
