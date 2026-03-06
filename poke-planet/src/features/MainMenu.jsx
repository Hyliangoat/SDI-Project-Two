import React from 'react'
import { PlayerContext } from '../app/Providers'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MainMenu() {
  const {player} = useContext(PlayerContext)
  const navi = useNavigate();

  const handleClick = (choice) =>{
    navi(`/${choice}`)
  }
  return (
    <div>
      <div onClick={() => handleClick('campaign')}>
        <h1>Campaign</h1>
        <p>Challenge another system</p>
      </div>
      <div onClick={() => handleClick('shop')}>
        <h1>Shop</h1>
        <p>Equip your planet</p>
      </div>
      <div onClick={() => handleClick('planet-care')}>
        <h1>Planet Care</h1>
        <p>Customize and care for your planet</p>
      </div>
        <p>Your planet is: {player.name}</p>
    </div>
  )
}
