import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://outside.funwebsite.fun/' : 'http://localhost:3000/';
//const URL = 'https://outside.funwebsite.fun/'
//const URL = 'http://localhost:3000/'
export const socket = io(URL, {
	path: "/teamlocations/"
});