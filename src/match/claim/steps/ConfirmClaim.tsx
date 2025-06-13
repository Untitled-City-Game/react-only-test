import { ClaimFormValues } from "@/src/match/claim/ClaimFlowModal";
import Span from "@/src/userInterface/Span";
import {
	Container,
	Image
} from "@mantine/core";

export default function ConfirmClaim({
	currentFormValues,
	zoneName
}: {
	currentFormValues: ClaimFormValues;
	zoneName: string;
}) {
	return (
		<Container>
			<Span>
				Claiming {zoneName} with
				challenge {currentFormValues.challenge}
			</Span>
			{currentFormValues.evidence && (
			<Image
				h={300}
				src={URL.createObjectURL(
					currentFormValues.evidence as unknown as File
				)}
				alt="evidence"
			/>
			)}
		</Container>
	);
}