import { games } from "@/scripts/consts";
import { GameContext } from "@/src/match/Board";
import { GameInviteButton } from "@/src/match/screens/game_status/Waiting";
import P from "@/src/userInterface/P";
import { Center, Modal, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { BsFillGearFill } from "react-icons/bs";

export default function SettingsIcon() {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<SettingsModal opened={opened} close={close} />
			<UnstyledButton onClick={open}>
				<Center>
					<BsFillGearFill size={20} />
				</Center>
			</UnstyledButton>
		</>
	);
}


export function SettingsModal({
	opened,
	close,
}: {
	opened: boolean;
	close: () => void;
}) {
	const props = useContext(GameContext);
	const game = games.find((game) => game.code === props.gameCode);
	const playerData = props.G.allPlayersData;
	return (
		<Modal
			opened={opened}
			onClose={close}
			title={
				<span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
					Settings
				</span>
			}>
			<P><strong>Host: </strong> {playerData[0]?.name}</P>
			<p><strong>Invite code: </strong>{props.matchID}</p>
			<GameInviteButton gameCode={props.gameCode} matchID={props.matchID} />
		
		</Modal>
	);
}
