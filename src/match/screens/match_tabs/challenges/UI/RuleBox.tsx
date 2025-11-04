import P from "@/src/userInterface/P";
import { Box } from "@mantine/core";
import { CiBookmarkCheck } from "react-icons/ci";

export default function RuleBox({children} : {children : React.ReactNode}){
	return (
		<Box style={{
			borderRadius: "10px",
			padding: "0rem",
			display: "flex",
			flexWrap: "nowrap",
			justifyContent: "flex-start",
			alignItems: "center",
			gap: "0.4rem",
		}}>
			<Box w="10%"><CiBookmarkCheck size="2rem" color="black"/></Box>
			<P fz="0.9rem">{children}</P>
		</Box>
	)
}