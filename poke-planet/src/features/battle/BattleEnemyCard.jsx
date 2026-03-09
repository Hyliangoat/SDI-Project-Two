import React from 'react'
import { requestEnemy } from '../../game/engine/battleEngine'
import { useState, useEffect } from 'react'
import { initializeEnemy } from '../../game/engine/battleEngine'
export default function BattleEnemyCard({currEnemy}) {
    const [enemy, setEnemy] = useState(null)


    useEffect(() => {
        let tempEnemy = requestEnemy()
        setEnemy (tempEnemy)
        initializeEnemy()
    }, [currEnemy])
    
    if(!enemy){
        return <p>Loading...</p>
    }

    return (
        <div>
            <p>{enemy.enemyName}</p>
            <img src={enemy.enemyAvatar} height='100px' width='100px' />
        </div>
    )
}
