// App.tsx
import ChooseMatch from "@/src/lobby/ChooseMatch";
import CreateMatch from "@/src/lobby/CreateMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import MatchLayout from "@/src/match/boardGame/MatchLayout";
import Match from "@/src/match/matchTabs/TabSet";
import ChooseGame from "@/src/site/ChooseGame";
import ExampleMap from "@/src/site/ExampleMap";
import OuterLayout from "@/src/site/outerLayout";
import SocketTest from "@/src/site/SocketTest";
import NotFound from "@/src/userInterface/NotFound";
import RootLayout from "@/src/userInterface/RootLayout";
import { BrowserRouter, Route, Routes } from "react-router";

export default function AppRouter(){
	return (
	<BrowserRouter>
		<Routes>
			<Route element={<RootLayout />}>
			<Route path="/location-test" element={<SocketTest />}></Route>
				<Route element={<OuterLayout />}>
					<Route index element={<ChooseGame />} />
					<Route path="map" element={<ExampleMap />} />
				</Route>
				<Route path="match" element={<MatchLayout />}>
					<Route index element={<Match />} />
				</Route>
				<Route path="lobby" element={<LobbyLayout />}>
					<Route path=":gameCode/join-match/:matchID" element={<JoinMatch />} />
					<Route path=":gameCode/create-match" element={<CreateMatch />} />
					<Route path=":gameCode/choose-match" element={<ChooseMatch />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	</BrowserRouter>
	)
}

