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
			clearable = {claimForm.getValues().evidence !== undefined}
			{...claimForm.getInputProps("evidence")} />
	);
}
