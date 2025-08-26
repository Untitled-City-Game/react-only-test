import P from "@/src/userInterface/P";
import { Button, ButtonProps, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function ConfirmButton({action, description, children, ...rest}: {action:  (...args: any[]) => void, description: string, children: React.ReactNode} & ButtonProps) { 
  const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
		<Button variant={rest.variant || "filled"} onClick = {open}>{children}</Button>
		<Modal zIndex={1000} opened={opened} onClose={close} title="Confirm" centered>
			<Stack>
        	<P>Are you sure you want to {description}?</P>
			<Button onClick={() => {
					action();
					close();
				}}>Confirm</Button>
			</Stack>
      	</Modal>
		</>
	)
}