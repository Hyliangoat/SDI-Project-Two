import MainRouter from "./MainRouter";
import { SessionProvider } from "../context/SessionProvider";
import { GameDataProvider } from "../context/GameDataProvider";
import { BattleProvider } from "../context/BattleProvider";

function App() {
  return (
    <SessionProvider>
      <GameDataProvider>
        <BattleProvider>
          <MainRouter />
        </BattleProvider>
      </GameDataProvider>
    </SessionProvider>
  );
}

export default App;
