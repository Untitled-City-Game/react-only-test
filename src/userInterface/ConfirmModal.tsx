import P from "@/src/userInterface/P";
import { Button, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function ConfirmButton({action, description, children, variant}: {action:  (...args: any[]) => void, description: string, children: React.ReactNode, variant: string}) { 
  const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
		<Button variant={variant} onClick = {open}>{children}</Button>
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