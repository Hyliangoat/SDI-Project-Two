import { createContext, useState } from "react";

export const BattleContext = createContext()

export function BattleProvider({children}){
    
    const[battle, setBattle] = useState({
        playerHp: null,
        enemyHp: null,
        currEnemy: 0
    })

    return(
        <BattleContext.Provider value={{battle, setBattle}}>
            {children}
        </BattleContext.Provider>
    )
}
//This went no where. I'll try to implement a battle context at a later date