import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { PlayerContext } from '../../app/Providers'
import { useNavigate } from 'react-router-dom'

export default function PlanetViewPage() {
  const {player, setPlayer} = useContext(PlayerContext)
  const navi = useNavigate()

  //temp example to help me remember this
  const feedPlanet = () => { 
    setPlayer(prevPlayer => ({
      ...prevPlayer, affinity: prevPlayer.affinity + 5
    }))
  }

  const returnMenu = () => {
    navi('/main')
  }

  return (
    <div>
      <button onClick = {returnMenu}>Return to main menu</button>
      <p>Take care of your planet: {player.name}</p>
      <img src={player.avatar} width='100px' height='100px' />
      <p>Current affinitity: {player.affinity}</p>
      <p>Favorite element: {player.favoriteElement}</p>
      <button onClick={feedPlanet}>Feed Planet</button>
    </div>
  )
}
