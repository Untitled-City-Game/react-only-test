import { Challenge, Color } from "@/scripts/types";
import { ChallengeCard } from "@/src/userInterface/challenges/ChallengeCard";
import DashedCard from "@/src/userInterface/DashedCard";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function ChallengePopup({
	opened,
	close,
	challengeInfo,
	team,
	completed
}: {
	opened: boolean;
	close: () => void;
	challengeInfo: Challenge;
	team: Color;
	completed?: boolean
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
			<ChallengeCard teamColor={team} challenge={challengeInfo} completed={completed}/>
			</Modal.Content>
		</Modal.Root>
	)
}

export function ChallengeButton({
	challenge,
	team,
	completed
} : {
	challenge: Challenge;
	team: Color;
	completed?: boolean;
}){
	const [opened, { open, close }] = useDisclosure(false);
	
	return(
	<><DashedCard color={team} bd={challenge.hard ? `4px double ${team}` : `1.5px dashed ${team}`}
	onClick={open}
	>
			<h3>{challenge.emoji} {challenge.title}</h3>
	</DashedCard>
	<ChallengePopup opened={opened} close={close} challengeInfo={challenge} team={team} completed={completed} />
	</>
	
)
}