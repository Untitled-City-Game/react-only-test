import { Center, Image, Stack } from "@mantine/core";

export default function Loading({message = "Loading"} : {message? : string}) {
	return (
	<Center h="100vh" bg="white">
		<Stack align="center">
	<Image w="50%" src='/train.gif'/>
	<span>{message}</span>
	</Stack>
	</Center>
	)
}