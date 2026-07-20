import {
  EnergyContext,
  InventoryContext,
  PlayerContext,
  ShopContext,
} from '../context/GameContexts';
import { usePersistentState } from '../hooks/usePersistentState';

export function PlayerProvider({ children }) {
  const [player, setPlayer] = usePersistentState('player', null);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function EnergyProvider({ children }) {
  const [energy, setEnergy] = usePersistentState('energy', { amount: 0 });

  return (
    <EnergyContext.Provider value={{ energy, setEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
}

export function ShopProvider({ children }) {
  const [shop, setShop] = usePersistentState('shop', []);

  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = usePersistentState('inventory', []);

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}