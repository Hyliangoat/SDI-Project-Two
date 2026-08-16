import React from 'react'
import { createBoss } from '../../game/models/BossPlanet'
import { useState, useEffect } from 'react'
import { assignBoss } from '../../game/engine/battleEngine'

export default function CampBossCard() {
    const [boss, setBoss] = useState(null)

    useState(() => {
        const spawnBoss = async () => {
            let tempBoss = await createBoss();
            setBoss(tempBoss)
            assignBoss(tempBoss)
        }
        spawnBoss()

    }, [])

    if(!boss){
        return (
            <p>Loading boss...</p>
        )
    }

    return (
        <div>
            <p>{boss.name}</p>
            <img src={boss.bossAvatar} width="200px" height="200px" />

        </div>
    )
}
