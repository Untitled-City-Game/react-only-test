import type { MetroGameBoardProps } from "@/scripts/types";
import { ListButton } from "@/src/userInterface/ListButton";
import Span from "@/src/userInterface/Span";
import { Container, Group, Radio } from "@mantine/core";

export function ChooseZone({
	props, radioGroupProps,
}: {
	props: MetroGameBoardProps;
	radioGroupProps: Record<string, unknown>
}) {
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const zoneCards = props.G.zoneData.map((zone, index) => {
		return (
			<ListButton component={Radio.Card} value={`${zone.id}`} key={index} color={myTeam}>
					<Group wrap="nowrap" align="center">
						<Radio.Indicator size="lg" />
						<div>
							<Span fz="lg" fw="bold">{zone.name}</Span>
							{/* <Span>{challenge.description}</Span> */}
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
					{zoneCards}
				</Group>
			</Radio.Group>
		</Container>
	);
}
