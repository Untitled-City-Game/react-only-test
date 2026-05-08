import { localColorName } from "@/src/styles/theme";
import { ButtonCssVariables, ButtonGroup, ButtonGroupSection, ButtonProps, ButtonStylesNames, ButtonVariant, createPolymorphicComponent, ElementProps, ExtendComponent, FactoryPayload, MantineThemeComponent, PolymorphicComponentProps } from "@mantine/core";
import { Button as MantineButton } from "@mantine/core"
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Link, LinkProps } from "react-router";

export function CustomButton(props: PolymorphicComponentProps<"button", ButtonProps>){
	const color = localColorName()
	return <MantineButton color={color} component={props.component} {...props}  />
}

const Button = createPolymorphicComponent<'button', ButtonProps>(CustomButton);
export default Button