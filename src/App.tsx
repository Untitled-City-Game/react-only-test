// App.tsx
import ChooseGame from "@/src/lobby/ChooseGame";
import CreateMatch from "@/src/lobby/CreateMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import Match from "@/src/match/matchTabs/Match";
import RootLayout from "@/src/userInterface/RootLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import MatchLayout from "./match/boardGame/MatchLayout";

const App = () => {
	console.time("load");
	return (<BrowserRouter>
		<Routes>
			<Route element={<RootLayout />}>
				<Route path="match" element={<MatchLayout />}>
					<Route index element={<Match />} />
				</Route>
				<Route path="/lobby?" element={<LobbyLayout />}>
					<Route path="join-match/:matchID" element={<JoinMatch />} />
					<Route path="create-match" element={<CreateMatch />} />
					<Route path="join-match" element={<JoinMatch />} />
					<Route index element={<ChooseGame />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>)
}

export default App;
