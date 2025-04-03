;
import { MetroGameBoardProps } from "@/scripts/types";
import { FileInput } from "@mantine/core";
import { Form } from "./ClaimFlowModal";

export function Evidence({
	claimForm,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
}) {
	return (
		<FileInput
			label="Photo evidence"
			key={claimForm.key("evidence")}
			{...claimForm.getInputProps("evidence")} />
	);
}
