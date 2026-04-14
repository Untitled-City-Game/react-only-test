import { defaultColor } from "@/src/styles/theme";
import { ComplexHeader } from "@/src/userInterface/Header/Header";
import { Box, Group, Modal } from "@mantine/core";

export function ModalHeader(color?: string) {
	return <Modal.Header style={{gap: 0, padding: 0, justifyContent: "flex-start", alignItems: "flex-start"}} >
		<ComplexHeader
			color={color}
			w="100%">
			<Group
				w="100%"
				justify="space-between"
				align="flex-start"
				wrap="nowrap"
				gap="0">
				<Box flex="1 1 30px"></Box>
				<Box flex="1 0 auto" ta="center">
					<h1>{`Claim`}</h1>
				</Box>
				<Box flex="1 1 30px" ta="right">
					<Modal.CloseButton
						size={"lg"}
						mt="5px"
						mr="5px" />
				</Box>
			</Group>
		</ComplexHeader>
	</Modal.Header>;
}
