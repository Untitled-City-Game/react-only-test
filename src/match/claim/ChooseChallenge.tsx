;
import type { MetroGameBoardProps } from "@/scripts/types";
import type { Form } from "@/src/match/claim/ClaimFlowModal";
import Span from "@/src/userInterface/Span";
import { Container, Group, Paper, Radio } from "@mantine/core";

export function ChooseChallenge({
	props, claimForm,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
}) {
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	const challengeCards = challengeHand.map((challenge, index) => {
		return (
			<Radio.Card value={challenge.title} key={index}>
				<Paper radius="md" p="md">
					<Group wrap="nowrap" align="center">
						<Radio.Indicator size="lg" />
						<div>
							<Span fz="lg" fw="bold">{challenge.title}</Span>
							{/* <Span>{challenge.description}</Span> */}
						</div>
					</Group>
				</Paper>
			</Radio.Card>
		);
	});
	return (
		<Container>
			<Radio.Group
				label="Choose a challenge"
				key={claimForm.key("challenge")}
				{...claimForm.getInputProps("challenge")}>
				<Group>
					{challengeCards}
				</Group>
			</Radio.Group>
		</Container>
	);
}
