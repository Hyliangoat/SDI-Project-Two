import React from 'react'
import { createContext, useState, useEffect } from 'react'

export const PlayerContext = createContext();
export const InventoryContext = createContext();
export const EnergyContext = createContext();
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

export function EnergyProvider({children}) {
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');


    if (savedEnergy){
      return JSON.parse(savedEnergy)
    }

    return {amount : 0}
  });

  useEffect(() => {
    if (energy != null) {
      localStorage.setItem('energy', JSON.stringify(energy))
    }
  }, [energy])

  return (
    <EnergyContext.Provider value={{energy, setEnergy}}>
      {children}
    </EnergyContext.Provider>
  )
}

export function ShopProvider({children}) {
  const [shop, setShop] = useState(() => {
    const savedShop = localStorage.getItem('shop');


    if (savedShop){
      return JSON.parse(savedShop)
    }

    return []
  });

  useEffect(() => {
    if (shop != null) {
      localStorage.setItem('shop', JSON.stringify(shop))
    }
  }, [shop])

  return (
    <ShopContext.Provider value={{shop, setShop}}>
      {children}
    </ShopContext.Provider>
  )
}

export function InventoryProvider({children}) {
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem('inventory');


    if (savedInventory){
      return JSON.parse(savedInventory)
    }

    return []
  });

  useEffect(() => {
    if (inventory != null) {
      localStorage.setItem('inventory', JSON.stringify(inventory))
    }
  }, [inventory])

  return (
    <InventoryContext.Provider value={{inventory, setInventory}}>
      {children}
    </InventoryContext.Provider>
  )
}


