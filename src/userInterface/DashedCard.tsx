import { Card, CardProps, Group } from "@mantine/core";

export default function DashedCard({ children, color, ...rest }: { children: React.ReactNode, color: string } & React.HTMLAttributes<HTMLDivElement> & CardProps){
	return (
		<Card
			m="0"
			py="sm"
			px="lg"
			shadow="lg"
			style={{
				borderRadius: "10px",
			}}
			bd={`1.5px dashed ${color}`}
			{...rest}
			>
			<Group wrap="nowrap" gap="lg">
				{children}
			</Group>
		</Card>
	)
}