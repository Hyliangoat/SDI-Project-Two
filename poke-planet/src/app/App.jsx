import { useEffect, useRef } from 'react';
import MainRouter from './MainRouter';
import {
  EnergyProvider,
  InventoryProvider,
  PlayerProvider,
  ShopProvider,
} from './Providers';
import {SessionProvider} from '../context/SessionProvider';
import { BattleProvider } from '../context/BattleProvider';
import '../index.css';
import {GameDataProvider} from '../context/GameDataProvider';
import clickSound from '../assets/music/slimeyfox-last-credit-remaining-485095.mp3';

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