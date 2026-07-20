import { useEffect, useRef } from 'react';
import MainRouter from './MainRouter';
import {
  EnergyProvider,
  InventoryProvider,
  PlayerProvider,
  ShopProvider,
} from './Providers';
import { BattleProvider } from '../context/BattleProvider';
import '../index.css';
import clickSound from '../assets/music/slimeyfox-last-credit-remaining-485095.mp3';

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(clickSound);
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playMusic = () => {
    audioRef.current?.play().catch((error) => {
      console.warn('Music playback was blocked by the browser.', error);
    });
  };

  return (
    <PlayerProvider>
      <EnergyProvider>
        <ShopProvider>
          <InventoryProvider>
            <BattleProvider>
              <MainRouter />
              <button className="musicButton" onClick={playMusic}>
                Music On
              </button>
            </BattleProvider>
          </InventoryProvider>
        </ShopProvider>
      </EnergyProvider>
    </PlayerProvider>
  );
}

export default App;