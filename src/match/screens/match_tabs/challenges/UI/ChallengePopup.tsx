import { Challenge } from "@/scripts/games/challenge_deck/challenge_deck_types";
import { Color } from "@/scripts/types/types";
import { ChallengeCard } from "@/src/match/screens/match_tabs/challenges/UI/ChallengeCard";
import DashedCard from "@/src/userInterface/DashedCard";
import P from "@/src/userInterface/P";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function ChallengePopup({
	opened,
	close,
	challengeInfo,
	team,
	completed,
	claimButton
}: {
	opened: boolean;
	close: () => void;
	challengeInfo: Challenge;
	team: Color;
	completed?: boolean;
	claimButton?: boolean;
}){
	return (
		<Modal.Root opened={opened}
		onClose={close}
		centered
		transitionProps={{transition: "scale"}}
		>
			<Modal.Overlay />
			        <Modal.Content
					bg="none"
					>
			<ChallengeCard teamColor={team} challenge={challengeInfo} completed={completed} claimButton={claimButton}/>
			</Modal.Content>
		</Modal.Root>
	)
}

export function ChallengeButton({
	challenge,
	team,
	completed,
	claimButton
} : {
	challenge: Challenge;
	team: Color;
	completed?: boolean;
	claimButton?: boolean;
}){
	const [opened, { open, close }] = useDisclosure(false);
	
	return(
	<><DashedCard color={team} w="100%" bd={challenge.hard ? `4px double ${team}` : `1.5px dashed ${team}`}
	onClick={open}
	>
			<P>{challenge.emoji} {challenge.title}</P>
	</DashedCard>
	<ChallengePopup opened={opened} close={close} challengeInfo={challenge} team={team} completed={completed} claimButton={claimButton}/>
	</>
	
)
}