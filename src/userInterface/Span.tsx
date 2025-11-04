import { Text, TextProps } from "@mantine/core";
export default function Span({ children, ...rest }: TextProps & { children: React.ReactNode }) {
	return <Text span {...rest}>{children}</Text>;
}