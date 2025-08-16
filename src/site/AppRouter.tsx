// App.tsx
import ChooseMatch from "@/src/lobby/ChooseMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import ChooseGame from "@/src/site/ChooseGame";
import ExampleMap from "@/src/site/ExampleMap";
import OuterLayout from "@/src/site/outerLayout";
import NotFound from "@/src/match/screens/game_status/NotFound";
import RootLayout from "@/src/userInterface/RootLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import Match from "@/src/match/Match";
import CreateMatch from "@/src/lobby/CreateMatch/CreateMatch";

export default function AppRouter(){
	return (
	<BrowserRouter>
		<Routes>
			<Route element={<RootLayout />}>
				<Route element={<OuterLayout />}>
					<Route index element={<ChooseGame />} />
					<Route path="map" element={<ExampleMap />} />
				</Route>
				<Route path="/match" element={<Match />} />
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

