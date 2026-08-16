import React from 'react'
import { assignBoss, getBoss } from '../../game/engine/battleEngine'
import { useState, useEffect, useContext } from 'react'
import { initializeBoss } from '../../game/engine/battleEngine'

export default function BattleBossCard() {
  const [boss, setBoss] = useState(null)

  useEffect(() => {
    let tempBoss = getBoss()
    setBoss(tempBoss)
    initializeBoss()
  }, [])

  if(!boss){
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>{boss.name}</p>
      <img src={boss.bossAvatar} width="200px" height="200px" />
    </div>
  )
}
