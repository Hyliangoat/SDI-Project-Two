import React, { use } from 'react'
import { useEffect, useState } from 'react'
import { assignEnemies } from '../../game/engine/battleEngine'
import { createEnemy } from '../../game/data/enemies'

export default function CampEnemyCards({setLoading}) {
    const [enemy, setEnemy] = useState(null)


    useEffect(() => {
        const fetchEnemy = async () => {
            const tempEnemy = await createEnemy();
            setEnemy(tempEnemy)
            assignEnemies(tempEnemy)
            setLoading(prev => prev + 1)
        }
        fetchEnemy()
    }, [])

    if (!enemy){
        return <p>Loading...</p>
    }
    return (
        <div>
            <p>Enemy name: {enemy.enemyName}</p>
            <img src={enemy.enemyAvatar} height="100px" width="100px"/>
            <p>Hp: {enemy.enemyHp}</p>
            <p>Attack: {enemy.enemyAttack}</p>
            <p>Defense: {enemy.enemyDefense}</p>
            <p>Evasion: {enemy.enemyEvasion}</p>
        </div>
    )
}
