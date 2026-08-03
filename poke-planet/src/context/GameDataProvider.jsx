import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  EnergyContext,
  InventoryContext,
  PlayerContext,
  ShopContext,
} from './GameContexts';
import { GameActionsContext } from './GameActionsContext';

import { useSession } from '../hooks/useSession';
import { apiRequest } from '../services/apiClient';

import crownPic from '../assets/images/crown.png';
import shadesPic from '../assets/images/moreglasses.png';
import smartShadesPic from '../assets/images/smartglasses.png';
import blingPic from '../assets/images/bling.png';
import hatPic from '../assets/images/hat.png';

const IMAGE_BY_KEY = Object.freeze({
  crown: crownPic,
  hat: hatPic,
  shades: shadesPic,
  'smart-glasses': smartShadesPic,
  bling: blingPic,
});

const EMPTY_ENERGY = Object.freeze({
  amount: 0,
});

function hydrateItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    ...item,
    image: IMAGE_BY_KEY[item.image_key] ?? null,
  }));
}

function hydrateState(rawState = {}) {
  return {
    player: rawState.player ?? null,

    energy: rawState.energy ?? {
      ...EMPTY_ENERGY,
    },

    shop: hydrateItems(rawState.shop),

    inventory: hydrateItems(
      rawState.inventory,
    ),

    progress: rawState.progress ?? {
      campaignsCompleted: 0,
      bossesDefeated: 0,
    },
  };
}

export function GameDataProvider({
  children,
}) {
  const { token } = useSession();

  const [player, setPlayer] = useState(null);

  const [energy, setEnergy] = useState({
    ...EMPTY_ENERGY,
  });

  const [shop, setShop] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [
    hydratedToken,
    setHydratedToken,
  ] = useState(null);

  const [error, setError] = useState('');

  const loading = Boolean(token)
    && hydratedToken !== token;

  const clearGameState = useCallback(() => {
    setPlayer(null);

    setEnergy({
      ...EMPTY_ENERGY,
    });

    setShop([]);
    setInventory([]);
  }, []);

  const applyState = useCallback(
    (rawState) => {
      const state = hydrateState(rawState);

      setPlayer(state.player);
      setEnergy(state.energy);
      setShop(state.shop);
      setInventory(state.inventory);

      return state;
    },
    [],
  );

  const requestGame = useCallback(
    async (path, options = {}) => {
      if (!token) {
        throw new Error(
          'Authentication required.',
        );
      }

      const rawState = await apiRequest(
        `/game${path}`,
        {
          token,
          ...options,
        },
      );

      setError('');

      return applyState(rawState);
    },
    [
      token,
      applyState,
    ],
  );

  const refresh = useCallback(
    async () => {
      if (!token) {
        clearGameState();
        setHydratedToken(null);
        return null;
      }

      setHydratedToken(null);
      setError('');

      try {
        const rawState = await apiRequest(
          '/game/state',
          {
            token,
          },
        );

        return applyState(rawState);
      } catch (requestError) {
        const message = requestError
          instanceof Error
          ? requestError.message
          : 'Unable to load the saved game.';

        clearGameState();
        setError(message);

        throw requestError;
      } finally {
        setHydratedToken(token);
      }
    },
    [
      token,
      applyState,
      clearGameState,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      clearGameState();
      setError('');
      setHydratedToken(null);

      return () => {
        cancelled = true;
      };
    }

    setError('');

    apiRequest(
      '/game/state',
      {
        token,
      },
    )
      .then((rawState) => {
        if (!cancelled) {
          applyState(rawState);
        }
      })
      .catch((requestError) => {
        if (cancelled) {
          return;
        }

        const message = requestError
          instanceof Error
          ? requestError.message
          : 'Unable to load the saved game.';

        clearGameState();
        setError(message);
      })
      .finally(() => {
        if (!cancelled) {
          setHydratedToken(token);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    token,
    applyState,
    clearGameState,
  ]);

  const actions = useMemo(
    () => ({
      loading,
      error,
      refresh,

      selectStarter: (
        starterId,
        avatarUrl,
      ) => requestGame(
        '/starter',
        {
          method: 'POST',
          body: JSON.stringify({
            starterId,
            avatarUrl,
          }),
        },
      ),

      purchaseItem: (itemCode) => requestGame(
        '/purchase',
        {
          method: 'POST',
          body: JSON.stringify({
            itemCode,
          }),
        },
      ),

      feedPlanet: () => requestGame(
        '/feed',
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
      ),

      awardEnergy: (
        amount,
        campaignComplete = false,
      ) => requestGame(
        '/reward',
        {
          method: 'POST',
          body: JSON.stringify({
            amount,
            campaignComplete,
          }),
        },
      ),
    }),
    [
      loading,
      error,
      refresh,
      requestGame,
    ],
  );

  return (
    <PlayerContext.Provider
      value={{ player }}
    >
      <EnergyContext.Provider
        value={{ energy }}
      >
        <ShopContext.Provider
          value={{ shop }}
        >
          <InventoryContext.Provider
            value={{ inventory }}
          >
            <GameActionsContext.Provider
              value={actions}
            >
              {children}
            </GameActionsContext.Provider>
          </InventoryContext.Provider>
        </ShopContext.Provider>
      </EnergyContext.Provider>
    </PlayerContext.Provider>
  );
}