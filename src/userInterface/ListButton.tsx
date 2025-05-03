import {
	Card,
	createPolymorphicComponent,
	Group,
	UnstyledButton,
	UnstyledButtonProps,
} from "@mantine/core";
import { forwardRef } from "react";

interface CustomButtonProps extends UnstyledButtonProps {
	children: React.ReactNode;
	color: string;
}

export const ListButton = createPolymorphicComponent<
	"button",
	CustomButtonProps
>(
	forwardRef<HTMLButtonElement, CustomButtonProps>(
		({ children, color, ...others }, ref) => (
			<UnstyledButton {...others} ref={ref} bd="none">
				<Card
					m="0"
					py="sm"
					px="lg"
					bd={`1.5px dashed ${color}`}
					shadow="lg"
					style={{
						borderRadius: "10px",
					}}>
					<Group align="center" wrap="nowrap" gap="lg">
						{children}
					</Group>
				</Card>
			</UnstyledButton>
		)
	)
);
