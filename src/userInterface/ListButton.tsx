import DashedCard from "@/src/userInterface/DashedCard";
import {
	createPolymorphicComponent,
	UnstyledButton,
	UnstyledButtonProps
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
				<DashedCard color={color}>
					{children}
				</DashedCard>
			</UnstyledButton>
		)
	)
);