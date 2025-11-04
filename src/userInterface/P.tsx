import { Text, TextProps } from "@mantine/core";
export default function P({ children, ...rest }: TextProps & { children: React.ReactNode }) {
	return <Text {...rest}>{children}</Text>;
}