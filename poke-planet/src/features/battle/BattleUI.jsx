import React from 'react'
import HP from './HP'
import { PlayerContext } from '../../app/Providers'
import { useContext, useState, useEffect } from 'react'
import './BattlePage.css'

export default function BattleUI({refresh, newEnemy}) {
  const {player} = useContext(PlayerContext)

  return (
    <div className='healthBars'>
      <div className='playerHealth'>
        <p>Player health:</p>
        <HP self={player} refresh={refresh} />
      </div>

      <div className='enemyHealth'>
        <p>Enemy health:</p>
        <HP self={'enemy'} refresh={refresh} newEnemy={newEnemy}/>
      </div>
    </div>

  )
}
