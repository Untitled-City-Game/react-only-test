import { socket } from "@/scripts/socket";
import { useState, useEffect } from "react";

export default function SocketTest(){
	const [isConnected, setIsConnected] = useState(socket.connected);
  	const [fooEvents, setFooEvents] = useState<string[]>([]);
	useEffect(() => {
			function onConnect() {
				console.warn("socket.io is connected now")
				setIsConnected(true);
			}
	
			function onDisconnect() {
				console.warn("socket.io is disconnected now")
				setIsConnected(false);
			}

			function onFooEvent(value : string) {
      		setFooEvents(previous => [...previous, value]);
			
    }

	
			socket.on('connect', onConnect);
			socket.on('disconnect', onDisconnect);
			socket.on('foo', onFooEvent);
			
			return () => {
				socket.off('connect', onConnect);
				socket.off('disconnect', onDisconnect);
      			socket.off('foo', onFooEvent);
			};
		}, []);
	return(
		<div style={{color: "black"}}>
			<p>connection status: {isConnected ? "connected" : "disconnected"}</p>
			<button onClick={() => socket.connect()}>connect</button>
			<button onClick={() => socket.disconnect()}>disconnect</button>
			<button onClick={() => socket.emit("foo", "hello world")}>emit event</button>
			<ul>
			{
			fooEvents.map((event, index) =>
				<li key={ index }>{ event }</li>
			)
			}
			</ul>
		</div>
	)
}