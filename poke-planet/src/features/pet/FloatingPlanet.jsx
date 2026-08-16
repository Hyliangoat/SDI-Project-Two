import React, { useContext } from 'react'
import { PlayerContext } from '../../app/Providers'
import './PlanetViewPage.css'


export default function FloatingPlanet() {
  const {player} = useContext(PlayerContext)
  return (
    <div className='petPagePlanetContainer'>
      <div className='planetContainer'>
        <div className='petPagePlanet'>
          <p>{player.name}</p>
          <img src={player.avatar} height="150px" width='150px' className='planet'/>

        </div>
      </div>

      <div className='petPagePlanetInfo'>
        <p>{player.description}</p>
        <p>Base HP: {player.baseStats.hp + (player.affinity/5)}</p>
        <p>Base Attack: {player.baseStats.attack + (player.affinity/5)}</p>
        <p>Base Defense: {player.baseStats.defense + (player.affinity/5)}</p>
        <p>Base Evasion: {player.baseStats.evasion + (player.affinity/5)}</p>
      </div>
    </div>
  )
}
