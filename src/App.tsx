// App.tsx
import ChooseMatch from "@/src/lobby/ChooseMatch";
import CreateMatch from "@/src/lobby/CreateMatch";
import JoinMatch from "@/src/lobby/JoinMatch";
import LobbyLayout from "@/src/lobby/LobbyLayout";
import Match from "@/src/match/mapTab/Match";
import { BrowserRouter, Route, Routes } from "react-router";
import MatchLayout from './match/MatchLayout';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="match" element={<MatchLayout />}>
        <Route index element={<Match />} />
      </Route>
      <Route path="lobby" element={<LobbyLayout />}>
        <Route path="join-match" element={<JoinMatch />} />
        <Route path="create-match" element={<CreateMatch />} />
        <Route path="choose-match" element={<ChooseMatch />} />
      </Route>
    </Routes>
  </BrowserRouter>

  );
  
export default App;
