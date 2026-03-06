import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { fetchPlanetCard, createStarterPlanet} from '../../game/models/PlayerPlanet'
import { PlayerContext } from '../../app/Providers'
import { useNavigate } from 'react-router-dom'

export default function StarterCard({name}) {
    const [card, setCard] = useState(null)
    const {setPlayer} = useContext(PlayerContext)
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
    navi('/Main');
  }

  return (
    <div onClick={handleClick}>
      <p>{card.name}</p>
      <img src={card.avatar} height='100px' width='100px' />
      <p>{card.description}</p>
      <p>Base HP: {card.baseStats.hp}</p>
      <p>Base Attack: {card.baseStats.attack}</p>
      <p>Base Defense: {card.baseStats.defense}</p>
      <p>Base Evasion: {card.baseStats.evasion}</p>
    </div>
  )
}
