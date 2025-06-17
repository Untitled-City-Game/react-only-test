import type { MetroGameBoardProps } from "@/scripts/types";
import { ListButton } from "@/src/userInterface/ListButton";
import Span from "@/src/userInterface/Span";
import { Container, Group, Radio } from "@mantine/core";

export function ChooseChallenge({
	props, radioGroupProps,
}: {
	props: MetroGameBoardProps;
	radioGroupProps: Record<string, unknown>
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
			<ListButton component={Radio.Card} value={challenge.title} key={index} color={myTeam}>
					<Group wrap="nowrap" align="center">
						<Radio.Indicator size="lg" />
						<div>
							<Span fz="lg" fw="bold">{challenge.title}</Span>
						</div>
					</Group>
			</ListButton>
		);
	});
	return (
		<Container>
			<Radio.Group
				label="Choose a challenge"
				{...radioGroupProps}
				>
				<Group>
					{challengeCards}
				</Group>
			</Radio.Group>
		</Container>
	);
}
