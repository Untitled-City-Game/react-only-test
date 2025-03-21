import { ZoneData } from "@/scripts/types";
import ClaimFlow from "@/src/match/claim/ClaimFlow";
import { Button, Center, Container, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function SelectedZonePopup({
	currentZone,
}: {
	currentZone: ZoneData | undefined;
}) {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Center
				style={infoZoneStyles}
				display={currentZone ? "initial" : "none"}>
				<Container>
					<Paper>
						<Button onClick={open}>
							Claim {currentZone?.name}
						</Button>
					</Paper>
				</Container>
			</Center>
			<ClaimFlow 
			open={opened}
			close={close}
			claimedZone={currentZone} 
			/>
		</>
	);
}

const infoZoneStyles: React.CSSProperties = {
	flexBasis: "20px",
	flexGrow: 1,
};
