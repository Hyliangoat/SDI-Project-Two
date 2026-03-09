import React, { useContext } from 'react'
import { PlayerContext, InventoryContext, ShopContext, EnergyContext } from '../../app/Providers'
import './ShopPage.css'
export default function ShopItem({item, energyCost, name, description, stat, statIncrease}) {
  const {energy, setEnergy} = useContext(EnergyContext)
  const {setInventory} = useContext(InventoryContext)
  const {setPlayer} = useContext(PlayerContext)

  const handleClick = () => {
    if(energy.amount > energyCost){
      setInventory(prevInventory => [...prevInventory, item])
      setEnergy(prevEnergy => ({
      ...prevEnergy, amount: prevEnergy.amount - energyCost
    }))

    switch(stat){
      case('crown'):
          setPlayer(prev => ({
          ...prev, baseStats: 
          { hp: prev.baseStats.hp,
            attack: prev.baseStats.attack + 100,
            defense: prev.baseStats.defense + 30,
            evasion: prev.baseStats.evasion + 20
          }
        }))
        break;
      case('defense'):
        setPlayer(prev => ({
            ...prev, baseStats: 
            { hp: prev.baseStats.hp,
              attack: prev.baseStats.attack,
              defense: prev.baseStats.defense + 20,
              evasion: prev.baseStats.evasion
            }
          }))
          break;
      case('attack'):
        setPlayer(prev => ({
            ...prev, baseStats: 
            { hp: prev.baseStats.hp,
              attack: prev.baseStats.attack + 20,
              defense: prev.baseStats.defense,
              evasion: prev.baseStats.evasion
            }
          }))
          break;
      case('evasion'):
        setPlayer(prev => ({
              ...prev, baseStats: 
              { hp: prev.baseStats.hp,
                attack: prev.baseStats.attack,
                defense: prev.baseStats.defense,
                evasion: prev.baseStats.evasion + 20
              }
            }))
            break;
      case('hp'):
            setPlayer(prev => ({
            ...prev, baseStats: 
            { hp: prev.baseStats.hp + 100,
              attack: prev.baseStats.attack,
              defense: prev.baseStats.defense,
              evasion: prev.baseStats.evasion
            }
          }))
          break;
    }
    } else{
      console.log('Sorry, broke boy')
    }
  }

  return (
    <div className='shopItem' onClick={handleClick}>
      <img src={item} height='100px' width='100px' />
      <p>{name}</p>
      <p>{description}</p>
      <p>Price: {energyCost} energy</p>
    </div>
  )
}
