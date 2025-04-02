import { ZoneData } from "@/scripts/types";
import ClaimFlowModal from "@/src/match/claim/ClaimFlowModal";
import { Button, Center, Container, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function SelectedZonePopup({
	currentZone,
	style
}: {
	currentZone: ZoneData | undefined;
	style: React.CSSProperties;
}) {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Center
				style={style}
				display={currentZone ? "initial" : "none"}>
				<Container style={selectedStyles}>
					<Paper>
						<Center>
						<Button onClick={open}>
							Claim {currentZone?.name}
						</Button>
						</Center>
					</Paper>
				</Container>
			</Center>
			<ClaimFlowModal 
			open={opened}
			close={close}
			claimedZone={currentZone} 
			/>
		</>
	);
}

const selectedStyles: React.CSSProperties = {
	padding: "1em",
};