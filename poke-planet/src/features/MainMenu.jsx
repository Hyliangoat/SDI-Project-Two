import React from 'react'
import { PlayerContext } from '../app/Providers'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './MainMenu.css'

export default function MainMenu() {
  const {player} = useContext(PlayerContext)
  const navi = useNavigate();

  const handleClick = (choice) =>{
    navi(`/${choice}`)
  }

  return (
    <div className='main-menu'>
      <h1 className='menu-title'>Poke-Planet</h1>
      <p className='player-info'>Your planet is: <span>{player.name}</span></p>
      <div className='menu-grid'>
        <div className='menu-card' onClick={() => handleClick('campaign')}>
          <h1>Campaign</h1>
          <p>Challenge another system</p>
        </div>
        <div className='menu-card' onClick={() => handleClick('shop')}>
          <h1>Shop</h1>
          <p>Equip your planet</p>
        </div>
        <div className='menu-card' onClick={() => handleClick('planet-care')}>
          <h1>Planet Care</h1>
          <p>Customize and care for your planet</p>
        </div>
      </div>
    </div>
  )
}
