;
import { MetroGameBoardProps } from "@/scripts/types";
import { FileInput } from "@mantine/core";

export function Evidence({
	props, radioGroupProps,
}: {
	props: MetroGameBoardProps;
	radioGroupProps: Record<string, unknown>
}) {
	return (
		<FileInput
			label="Evidence"
			multiple
			// clearable = {claimForm.getValues().evidence !== undefined}
			{...radioGroupProps}
			/>
	);
}
