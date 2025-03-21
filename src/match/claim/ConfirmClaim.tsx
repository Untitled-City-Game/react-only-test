import { ZoneData } from "@/scripts/types";
import {
	Container,
	Image
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
type Form = UseFormReturnType<
	{
		challenge: string;
		evidence: string;
	},
	(values: { challenge: string; evidence: string; }) => {
		challenge: string;
		evidence: string;
	}
>;

export default function ConfirmClaim({
	claimForm,
	claimedZone,
}: {
	claimForm: Form;
	claimedZone: ZoneData;
}) {
	return (
		<Container>
			<Span>
				Claiming {claimedZone.name} with
				challenge {claimForm.getValues().challenge}
			</Span>
			{claimForm.getValues().evidence && (
			<Image
				h={300}
				src={URL.createObjectURL(
					claimForm.getValues().evidence as unknown as File
				)}
				alt="evidence"
			/>
			)}
		</Container>
	);
}