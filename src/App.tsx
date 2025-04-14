// App.tsx
import ChooseGame from "@/src/lobby/ChooseGame";
import ChooseMatch from "@/src/lobby/ChooseMatch";
import CreateMatch from "@/src/lobby/CreateMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import Match from "@/src/match/matchTabs/Match";
import RootLayout from "@/src/userInterface/RootLayout";
import MatchLayout from "@src/match/boardGame/MatchLayout";
import NotFound from "@src/userInterface/NotFound";
import { BrowserRouter, Route, Routes } from "react-router";

const App = () => {
	console.time("load");
	console.log(process.env.NODE_ENV);
	console.log(process.env.APP_ENVIRONMENT);
	return (
	<BrowserRouter>
		<Routes>
			<Route element={<RootLayout />}>
				<Route path="match" element={<MatchLayout />}>
					<Route index element={<Match />} />
				</Route>
				<Route path="lobby?" element={<LobbyLayout />}>
					<Route path="join-match/:matchID" element={<JoinMatch />} />
					<Route path="create-match" element={<CreateMatch />} />
					<Route path="choose-match" element={<ChooseMatch />} />
					<Route index element={<ChooseGame />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	</BrowserRouter>
	)
}

export default App;
