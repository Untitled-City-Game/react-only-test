import { Button, Center, Modal, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BsQuestionCircleFill } from "react-icons/bs";

export default function HelpIcon() {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<HelpModal opened={opened} close={close} />
			<UnstyledButton onClick={open}>
				<Center>
					<BsQuestionCircleFill size={20} />
				</Center>
			</UnstyledButton>
		</>
	);
}

export function HelpButton() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button variant="outline" onClick={open}>How to play</Button>
			<HelpModal opened={opened} close={close} />
		</>
	);
}

export function HelpModal({
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
			title={
				<span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
					How to play Connect 4
				</span>
			}>
<p>Claim neighbourhoods by visiting them and completing a challenge.</p>
<p>The first team to connect four neighbourhoods in a line win the game!</p>
<h3 id="-challenges-"><strong>Challenges</strong></h3>
<p>To claim a neighbourhood, go there and complete a challenge.</p>
<p>You must remain inside the neighbourhood while completing the challenge.</p>
<p>When a challenge is completed, a new challenge is drawn.</p>
<h4 id="-discarding-"><strong>Discarding</strong></h4>
<p>You can discard and redraw your hand of challenges.</p>
<p>When you do, you must freeze in place for ten minutes. You may not complete any challenges during that time.</p>
<p>There is a limited number of challenges in the deck. If you run out, you can&#39;t claim any more neighbourhoods, so be careful!</p>
<h3 id="-travel-"><strong>Travel</strong></h3>
<p>You can travel by public transit or on foot.</p>
<p>Optionally, you may play with hybrid transit such as bikeshare, ferries or private bus services. Be sure to discuss and agree on what is allowed before playing.</p>
<p>Including cars or private vehicles is strongly discouraged - a lot of the fun competition comes from transit logistics!</p>
<h3 id="-making-a-line-"><strong>Making a line</strong></h3>
<p>The game ends when a team connects 4 neighbourhoods in a straight line, horizontally or vertically.</p>
<p>Possible winning lines are shown on the map when you select a neighbourhood.</p>
<h4 id="-ties-"><strong>Ties</strong></h4>
<p>If neither team completes a line within 4 hours, the team with the most neighbourhoods wins.</p>
<p>If both teams have the same number of neighbourhoods, the team who controls the largest physical area wins.</p>
		</Modal>
	);
}
