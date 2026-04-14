import * as device from 'react-device-detect';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import P from '@/src/userInterface/P';
import Span from '@/src/userInterface/Span';

export default function SafariWarning(){
	const [opened, { open, close }] = useDisclosure(device.isMobileSafari);
	return (
		<Modal opened={opened} onClose={close} title={<h2>Oh no Safari :(</h2>}>
       		<P>Hi! It looks like you're using Safari on mobile.</P>
			<P>You CAN technically play using Safari, but a lot of things might break, including maps, location, and like, scrolling down.</P>
			<P>We've tested other browsers (Chrome, Firefox) on iPhone and we're confident those will work better for you.</P>
			<P>Thanks for understanding!</P>
      	</Modal>
	)
}