import { useCallback, useEffect, useMemo, useState } from 'react';
import { EnergyContext, InventoryContext, PlayerContext, ShopContext } from './GameContexts';
import { GameActionsContext } from './GameActionsContext';
import { useSession } from '../hooks/useSession';
import { apiRequest } from '../services/apiClient';
import crownPic from '../assets/images/crown.png';
import shadesPic from '../assets/images/moreglasses.png';
import smartShadesPic from '../assets/images/smartglasses.png';
import blingPic from '../assets/images/bling.png';
import hatPic from '../assets/images/hat.png';

const IMAGE_BY_KEY = { crown: crownPic, hat: hatPic, shades: shadesPic, 'smart-glasses': smartShadesPic, bling: blingPic };

function hydrateState(state) {
  return {
    ...state,
    shop: state.shop.map((item) => ({ ...item, image: IMAGE_BY_KEY[item.image_key] })),
    inventory: state.inventory.map((item) => ({ ...item, image: IMAGE_BY_KEY[item.image_key] })),
  };
}

export function GameDataProvider({ children }) {
  const { token } = useSession();
  const [player, setPlayer] = useState(null);
  const [energy, setEnergy] = useState({ amount: 0 });
  const [shop, setShop] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  const applyState = useCallback((raw) => {
    const state = hydrateState(raw);
    setPlayer(state.player); setEnergy(state.energy); setShop(state.shop); setInventory(state.inventory);
    return state;
  }, []);

  const requestGame = useCallback(async (path, options = {}) => {
    if (!token) throw new Error('Authentication required.');
    const raw = await apiRequest(`/game${path}`, { token, ...options });
    return applyState(raw);
  }, [token, applyState]);

  const refresh = useCallback(async () => requestGame('/state'), [requestGame]);
  useEffect(() => {
    if (!token) { setPlayer(null); setEnergy({ amount: 0 }); setShop([]); setInventory([]); setLoading(false); return; }
    setLoading(true); setError('');
    refresh().catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [token, refresh]);

  const actions = useMemo(() => ({
    loading, error, refresh,
    selectStarter: (starterId, avatarUrl) => requestGame('/starter', { method: 'POST', body: JSON.stringify({ starterId, avatarUrl }) }),
    purchaseItem: (itemCode) => requestGame('/purchase', { method: 'POST', body: JSON.stringify({ itemCode }) }),
    feedPlanet: () => requestGame('/feed', { method: 'POST', body: '{}' }),
    awardEnergy: (amount, campaignComplete = false) => requestGame('/reward', { method: 'POST', body: JSON.stringify({ amount, campaignComplete }) }),
  }), [loading, error, refresh, requestGame]);

  return (
    <PlayerContext.Provider value={{ player }}>
      <EnergyContext.Provider value={{ energy }}>
        <ShopContext.Provider value={{ shop }}>
          <InventoryContext.Provider value={{ inventory }}>
            <GameActionsContext.Provider value={actions}>{children}</GameActionsContext.Provider>
          </InventoryContext.Provider>
        </ShopContext.Provider>
      </EnergyContext.Provider>
    </PlayerContext.Provider>
  );
}