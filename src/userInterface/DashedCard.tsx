import { Card, Group } from "@mantine/core";

export default function DashedCard({ children, color, ...rest }: { children: React.ReactNode, color: string } & React.HTMLAttributes<HTMLDivElement>){
	return (
		<Card
			m="0"
			py="sm"
			px="lg"
			bd={`1.5px dashed ${color}`}
			shadow="lg"
			style={{
				borderRadius: "10px",
			}}
			{...rest}
			>
			<Group wrap="nowrap" gap="lg">
				{children}
			</Group>
		</Card>
	)
}