import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.LOCATION_SERVER
export const socket = io(URL, {
	path: process.env.LOCATION_SERVER_PATH
});