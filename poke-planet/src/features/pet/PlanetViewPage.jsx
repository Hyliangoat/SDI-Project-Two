import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { EnergyContext, InventoryContext, PlayerContext } from '../../app/Providers'
import { PrefetchPageLinks, useNavigate } from 'react-router-dom'
import FloatingPlanet from './FloatingPlanet'

export default function PlanetViewPage() {
  const {player, setPlayer} = useContext(PlayerContext)
  const {inventory} = useContext(InventoryContext)
  const {energy, setEnergy} = useContext(EnergyContext)
  const navi = useNavigate()

  //temp example to help me remember this
  const feedPlanet = () => { 
    if(energy.amount >= 5){
      setPlayer(prevPlayer => ({
        ...prevPlayer, affinity: prevPlayer.affinity + 5
      }))
      setEnergy(prev => ({...prev, amount: prev.amount - 5}))
    }
  }

  const returnMenu = () => {
    navi('/main')
  }



  return (
    <>
      <button className='petButton' onClick = {returnMenu}>Return to main menu</button>
      <div className='petPage'>
        <div className= "petPlanetSection">
          <FloatingPlanet />
        </div>
        <div className='petToolsSection'>
          <p>Current affinity: {player.affinity}</p>
          <p>Favorite element: {player.favoriteElement}</p>
          <p>Feed planet (5 energy)</p>
          <p>Your energy: {energy.amount}</p>
          <button className='petButton' onClick={feedPlanet}>Feed Planet</button>
          <p>Your items: {inventory.length === 0 ? <span>None</span> : 
          inventory.map(
            (item, index) => <img src={item} height='50px' width='50px'/>
          )}</p>
        </div>
    </div>
    </>
  )
}
