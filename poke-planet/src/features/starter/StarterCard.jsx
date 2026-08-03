import { useState, useEffect } from 'react'
import { fetchPlanetCard, createStarterPlanet} from '../../game/models/PlayerPlanet'
import { useGameActions } from '../../hooks/useGameActions'
import { useNavigate } from 'react-router-dom'
import './StarterSelectPage.css'

export default function StarterCard({name}) {
    const [card, setCard] = useState(null)
    const { selectStarter } = useGameActions()
    const navi = useNavigate();

    useEffect(() => {
      async function fetchData() {
        const tempPlanet = await fetchPlanetCard(name)
        setCard(tempPlanet)
      }
    
    fetchData()

    }, [name])

  if(!card){
    return(
      <p>Loading...</p>
    )
  }

  const handleClick = async () => {
    console.log(`You clicked ${card.name}`)
    const playerChoice = await createStarterPlanet(name)
    await selectStarter(playerChoice.id, playerChoice.avatar)
    navi('/Main');
  }

  return (
    <div className='planet-card' onClick={handleClick}>
      <div className='planet-preview'>
        <img src={card.avatar} alt={card.name} />
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