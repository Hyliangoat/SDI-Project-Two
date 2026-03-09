import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { attackSequence, evadeSequence, healSequence, specialSequence } from '../../game/engine/battleEngine'
import { PlayerContext } from '../../app/Providers'
import './BattlePage.css'

export default function Skills({refreshBattle, playLog, battleLocked}) {
  const {player} = useContext(PlayerContext)

  function handleAttack(){
    const events = attackSequence(player)
    playLog(events)
    refreshBattle()
  }

  function handleEvade(){
    const events = evadeSequence(player)
    playLog(events)
    refreshBattle()
  }

  function handleSpecial(){
    const events = specialSequence(player)
    playLog(events)
    refreshBattle()
  }

  function handleHeal(){
    const events = healSequence(player)
    playLog(events)
    refreshBattle()
  }

  return (
    <div className = 'skillsButtons'>
      <button disabled={battleLocked} className='battleSkillsButton' onClick={handleAttack}>Attack</button>
      <button disabled={battleLocked} className='battleSkillsButton' onClick={handleEvade}>Evade</button>
      <button disabled={battleLocked} className='battleSkillsButton' onClick={handleSpecial}>Special</button>
      <button disabled={battleLocked} className='battleSkillsButton' onClick={handleHeal}>Heal</button>
    </div>
  )
}
