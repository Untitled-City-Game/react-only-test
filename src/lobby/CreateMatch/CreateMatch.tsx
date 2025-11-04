import CreateMatchConnectFour from "@/src/lobby/CreateMatch/CreateMatchConnectFour";
import CreateMatchSnake from "@/src/lobby/CreateMatch/CreateMatchSnake";
import { useParams } from "react-router";

export default function CreateMatch(){
	const gameCode = useParams().gameCode;
	switch(gameCode){
		case 'connect_four':
			return <CreateMatchConnectFour />
		case 'snake':
			return <CreateMatchSnake />
	}
}