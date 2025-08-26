import P from "@/src/userInterface/P";
import { Box } from "@mantine/core";
import { PiWarningDiamondFill } from "react-icons/pi";

export default function RuleBox({children} : {children : React.ReactNode}){
	return (
		<Box style={{
			border: "2px solid orange",
			borderRadius: "10px",
			padding: "1rem",
			display: "flex",
			flexWrap: "nowrap",
			justifyContent: "flex-start",
			alignItems: "center",
			gap: "1rem",
			backgroundColor: "#fffbccff"
		}}>
			<Box w="10%"><PiWarningDiamondFill size="2rem" color="orange"/></Box>
			<P>{children}</P>
		</Box>
	)
}