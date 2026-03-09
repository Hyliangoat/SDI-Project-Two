import React from 'react'
import { showHealth } from '../../game/engine/battleEngine'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HP({self, refresh, newEnemy}) {
  const [health, setHealth] = useState(0)
  const [maxHP, setMaxHP] = useState(1)
  const [updateMax, setUpdateMax] = useState(0)
  const navi = useNavigate()

  useEffect(() =>{
    const hp = showHealth(self)
    setMaxHP(hp)
  }, [updateMax])

  useEffect(() => {
    const hp = showHealth(self)
    setHealth(hp)
  }, [refresh])

  useEffect(() => {
    if(self === 'enemy' && health < 0){
      console.log('enemy dead')
      setTimeout(() => {
        newEnemy()
        setUpdateMax(prev => prev + 1)
      }, 4500)
    }else if(self != 'enemy' && health < 0){
      navi('/main')
    }
  },[health])

  const safeHealth = Math.max((health/maxHP) * 100, 0)

  return (
    <div className='hpContainer'>
      <div className='hpBar'>
        <div className='hpFill' style={{width: `${safeHealth}%`}} />
      </div>
      <p className='hpText'>{safeHealth}% HP</p>
    </div>
  )
}
