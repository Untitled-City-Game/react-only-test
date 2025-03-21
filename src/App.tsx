// App.tsx
import ChooseMatch from "@/src/lobby/ChooseMatch";
import CreateMatch from "@/src/lobby/CreateMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import Match from "@/src/match/mapTabs/Match";
import RootLayout from "@/src/userInterface/RootLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import MatchLayout from "./match/MatchLayout";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<RootLayout />}>
				<Route path="match" element={<MatchLayout />}>
					<Route index element={<Match />} />
				</Route>
				<Route path="/lobby?" element={<LobbyLayout />}>
					<Route path="join-match" element={<JoinMatch />} />
					<Route path="create-match" element={<CreateMatch />} />
					<Route index element={<ChooseMatch />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
);

export default App;
