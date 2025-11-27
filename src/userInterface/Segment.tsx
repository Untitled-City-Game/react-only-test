import { CardProps, useMantineTheme } from "@mantine/core";

export default function Segment({ children, color, ...rest }: { children: React.ReactNode, color?: string } & React.HTMLAttributes<HTMLDivElement> & CardProps){
	const theme = useMantineTheme();
	if(!color){
		color = theme.colors[theme.primaryColor][6] || "black"
	}
	return (
		<div style={{
			border: `2px dashed ${color}`,
			padding: '1rem',
			borderRadius: `10px`
		}}>
			{children}
		</div>
	)
}