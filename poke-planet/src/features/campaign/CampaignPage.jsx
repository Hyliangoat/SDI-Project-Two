import React from 'react'
import { fetchExoplanetData } from '../../services/exoplanetService'
import { createEnemyList } from '../../game/data/enemies'

export default function CampaignPage() {
  const spawnEnemyList = () => {
    createEnemyList()
  }
  return (
    <div>
      <button onClick={spawnEnemyList}>Spawn enemies</button>
      <h1>Ur chellengers:</h1>
      <p></p>
    </div>

  )
}
