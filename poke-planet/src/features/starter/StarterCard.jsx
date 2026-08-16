import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { fetchPlanetCard, createStarterPlanet} from '../../game/models/PlayerPlanet'
import { EnergyContext, InventoryContext, PlayerContext, ShopContext } from '../../app/Providers'
import { useNavigate } from 'react-router-dom'
import './StarterSelectPage.css'
import crownPic from '../../assets/images/crown.png'
import shadesPic from '../../assets/images/moreglasses.png'
import smartShadesPic from '../../assets/images/smartglasses.png'
import blingPic from '../../assets/images/bling.png'
import hatPic from '../../assets/images/hat.png'

export default function StarterCard({name}) {
    const [card, setCard] = useState(null)
    const {player, setPlayer} = useContext(PlayerContext)
    const {setEnergy} = useContext(EnergyContext)
    const {setShop} = useContext(ShopContext)
    const {setInventory} = useContext(InventoryContext)
    const navi = useNavigate();

    useEffect(() => {
      async function fetchData() {
        const tempPlanet = await fetchPlanetCard(name)
        setCard(tempPlanet)
      }
    
    fetchData()

    }, [])

  if(!card){
    return(
      <p>Loading...</p>
    )
  }

  const handleClick = async () => {
    console.log(`You clicked ${card.name}`)
    const playerChoice = await createStarterPlanet(name)
    setPlayer(playerChoice)
    setEnergy({amount: 500})
    setShop([crownPic, hatPic, shadesPic, smartShadesPic, blingPic])
    setInventory([])
    navi('/Main');
  }

  return (
    <div className='planet-card' onClick={handleClick}>
      <div className='planet-preview'>
        <img src={card.avatar} />
        <p>{card.name}</p>
      </div>

      <div className='planet-info'>
        <p>{card.description}</p>
        <p>Base HP: {card.baseStats.hp}</p>
        <p>Base Attack: {card.baseStats.attack}</p>
        <p>Base Defense: {card.baseStats.defense}</p>
        <p>Base Evasion: {card.baseStats.evasion}</p>
      </div>
    </div>
  )
}
