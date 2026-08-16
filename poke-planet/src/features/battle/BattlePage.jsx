import React from 'react'
import BattleUI from './BattleUI'
import Skills from './Skills'
import { EnergyContext, PlayerContext } from '../../app/Providers'
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { testing } from '../../game/engine/battleEngine'
import BattlePlayerCard from './BattlePlayerCard'
import BattleEnemyCard from './BattleEnemyCard'
import { resetRound } from '../../game/engine/battleEngine'
import { resetAll } from '../../game/engine/battleEngine'
import './BattlePage.css'
import BattleLog from './BattleLog'
import BattleBossCard from './BattleBossCard'

export default function BattlePage() {
  const [battleTick, setBattleTick] = useState(0)
  const [currEnemy, setCurrEnemy] = useState(0)
  const [battleLog, setBattleLog] = useState("")
  const [battleLocked, setBattleLocked] = useState(false)
  const {energy, setEnergy} = useContext(EnergyContext)

  const navi = useNavigate()

  useEffect(() => {
    setCurrEnemy(0)
    console.log('doing this ONCE')
  }, [])

const playLog = (events) => {
    setBattleLocked(true)
    let i = 0;
    function next(){
        if(i < events.length){
            setBattleLog(events[i])
            i++
            setTimeout(next, 2500)
        } else{
          setBattleLocked(false)
        }
    }
    next()
}
  const reward = (amountReward) => {
    console.log('Giving little treats')
    setEnergy(prevEnergy => ({
      ...prevEnergy, amount: prevEnergy.amount + amountReward
    }))
    console.log('New energy is' + energy.amount)
  }

  const refreshBattle = () => {
    setBattleTick(prev => prev + 1)
  }

  const newEnemy = () => {
    reward(20)
    setCurrEnemy(prev => prev + 1)
    setBattleTick(prev => prev + 1)
    resetRound()
  }

  const bossNav = () => {
    resetAll()
    reward(100)
    navi('/Main')
  }

  if(currEnemy < 4){
    return (
      <div className='battleContainer'>
        <div className='battleTitle'>
          <h2>Enemy {(currEnemy + 1)}</h2>
        </div>
        <div className='battlePlayer'>
          <BattlePlayerCard />
        </div>

        <div className='battleEnemy'>
          <BattleEnemyCard currEnemy={currEnemy}/>
        </div>

        <div className='battleUI'>
          <BattleUI refresh={battleTick} newEnemy={newEnemy}/>
        </div>

        <div className='battleStatus'>
          <BattleLog log={battleLog} />
        </div>

        <div className='battleSkills'>
        <Skills refreshBattle={refreshBattle} playLog={playLog} battleLocked={battleLocked}/>
        </div>

      </div>
    )
  }else if(currEnemy === 4){
    return(
      <div className='bossBattleContainer'>

        <div className='battleTitle'>
          <h2>Final Boss</h2>
        </div>
        <div className='battlePlayer'>
          <BattlePlayerCard />
        </div>

        <div className='battleEnemy'>
          <BattleBossCard />
        </div>

        <div className='battleUI'>
          <BattleUI refresh={battleTick} newEnemy={newEnemy}/>
        </div>

        <div className='battleStatus'>
          <BattleLog log={battleLog} />
        </div>

        <div className='battleSkills'>
        <Skills refreshBattle={refreshBattle} playLog={playLog} battleLocked={battleLocked}/>
        </div>

      </div>
    )
  }else if (currEnemy > 4){
    return(
      <div className='bossBattleContainer'>
          <div className='battleTitle'>
          <p>Reward page</p>
          <p>Your reward:</p>
          <p>100 Energy</p>
          <button onClick={bossNav} className='battleSkillsButton'>Good job!</button>
        </div>
      </div>
    )
  }
}
