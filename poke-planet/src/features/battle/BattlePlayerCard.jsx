import React from 'react'
import { PlayerContext } from '../../app/Providers'
import { useContext, useState, useEffect } from 'react'
import { intializePlayer } from '../../game/engine/battleEngine'

export default function BattlePlayerCard() {
    const {player, setPlayer} = useContext(PlayerContext)

    useEffect(() => {
        intializePlayer(player)
    }, [])
    
    return (
        <div>
            <p>{player.name}</p>
            <img src={player.avatar} width="100px" height="100px" />
        </div>
    )
}
