import React from 'react'
import { createContext, useState, useEffect } from 'react'

export const PlayerContext = createContext();
export const InventoryContext = createContext();
export const ShopContext = createContext();

export function PlayerProvider({children}) {
  const [player, setPlayer] = useState(() => {
    const savedPlayer = localStorage.getItem('player');


    if (savedPlayer){
      return JSON.parse(savedPlayer)
    }

    return null
  });

  useEffect(() => {
    if (player != null) {
      localStorage.setItem('player', JSON.stringify(player))
    }
  }, [player])

  return (
    <PlayerContext.Provider value={{player, setPlayer}}>
      {children}
    </PlayerContext.Provider>
  )
}

export function InventoryProvider() {
  const [inventory, setInventory] = useState(null);

  return (
    <InventoryContext.Provider value={{inventory, setInventory}}>
      {children}
    </InventoryContext.Provider>
  )
}

export function ShopProvider() {
  const [shop, setShop] = useState(null);

  return (
    <ShopContext.Provider value={{shop, setShop}}>
      {children}
    </ShopContext.Provider>
  )
}
