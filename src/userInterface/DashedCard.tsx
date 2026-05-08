import { Card, CardProps, Group } from "@mantine/core";

type StyledCardProps = { children: React.ReactNode, color: string, variant?: "dashed" | "solid" } & React.HTMLAttributes<HTMLDivElement> & CardProps;

function StyledCard({ children, color, variant = "dashed", ...rest }: StyledCardProps){
	return (
		<Card
			// m="0"
			py="sm"
			px="lg"
			shadow="lg"
			style={{
				borderRadius: "10px",
			}}
			bd={`1.5px ${variant} ${color}`}
						{...rest}

			>
			<Group wrap="nowrap" gap="lg">
				{children}
			</Group>
		</Card>
	)
}

export default StyledCard;

export function SolidCard({ children, ...rest }: Omit<StyledCardProps, "variant">){
	return <StyledCard variant="solid" {...rest}>{children}</StyledCard>
}
