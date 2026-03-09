import React from 'react'
import { useState, useEffect } from 'react'

export default function BattleLog({log}) {
    const [displayText, setDisplayText] = useState("")
    
    
    useEffect(() => {
        setDisplayText("")
        let i = 0;
        let typeInterval;

        const start = setTimeout(() => {
            typeInterval = setInterval(() => {
                setDisplayText(prev => prev + log.charAt(i))
                i++

                if(i >= log.length){
                    clearInterval(typeInterval)
                }
                }, 10)
        }, 5)
        
        return () => {
            clearTimeout(start)
            clearInterval(typeInterval)
        }
    }, [log])

    return (
        <div className="battleLog">
            <p>{displayText}</p>
        </div>
    )
}
