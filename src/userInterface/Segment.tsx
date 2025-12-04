import { defaultColor } from "@/src/styles/theme";
import { CardProps, MantineProvider, mergeMantineTheme, useMantineTheme } from "@mantine/core";

export default function Segment({ children, color, ...rest }: { children: React.ReactNode, color?: string } & React.HTMLAttributes<HTMLDivElement> & CardProps){
	return (
			<div style={{
				border: `2px dashed ${defaultColor({color})}`,
				padding: '1rem',
				borderRadius: `10px`
			}}>
				{children}
			</div>
	)
}