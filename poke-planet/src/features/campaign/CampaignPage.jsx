import React from 'react'
import { fetchExoplanetData } from '../../services/exoplanetService'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CampEnemyCards from './CampEnemyCards'
import CampBossCard from './CampBossCard'
import './CampaignPage.css'

export default function CampaignPage() {
  const navi = useNavigate();
  const [loading, setLoading] = useState(0)


  const battleTime = () => {
    navi('/battle')
  }


  return (
    <div className='campaign-container'>
      <h1 className='campaign-title'>Campaign</h1>
      <div className='campaign-boss'>
        <div className='campaign-card'>
        <h2>System Overlord</h2>
          <CampBossCard />
        </div>
      </div>

      <h2 className='campaign-minions'>The underlings</h2>

      <div className='campaign-one'>
        <div className='campaign-card'>
          <CampEnemyCards setLoading={setLoading}/>
        </div>
      </div>

      <div className='campaign-two'>
        <div className='campaign-card'>
          <CampEnemyCards setLoading={setLoading}/>
        </div>
      </div>

      <div className='campaign-three'>
        <div className='campaign-card'>
          <CampEnemyCards setLoading={setLoading}/>
        </div>
      </div>

      <div className='campaign-four'>
        <div className='campaign-card'>
          <CampEnemyCards setLoading={setLoading}/>
        </div>
      </div>

      <div className='campaign-button'>
        {loading < 4 ? <p>Loading your challengers...</p> : <button className='campaign-button' onClick={battleTime}>Begin Campaign</button>}
      </div>
    </div>

  )
}
