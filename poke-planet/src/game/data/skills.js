import { Jupiter, Pluto, Sol, Gaia, Uranus, Luna } from "./starterPlanets";

export function SolSpec(player, enemy, log){
    enemy.enemyHealth -= 60;
    log = ` ${player.name} releases a solar flare upon ${enemy.enemyName}, ripping their atmosphere apart for 60 unblockable damage!`
}

export function GaiaSpec(player, enemy, log){
    player.health += 30;
    log = ` ${player.name} begins to absorb energy from their sun, healing 30 health per turn the next 3 turns!`
}

export function LunaSpec(player, enemy, log){
    player.evasion += 50;
    log = ` ${player.name} cloaks itself in darkness, greatly increasing evasion for 3 turns!`
}

export function AnussSpec(player, enemy, log){
    enemy.enemyDefense -= 50;
    log = ` ${player.name} unleashes a gale of ice upon ${enemy.name}, drastically lowering their defense for 3 turns!`
}

export function JupiterSpec(player, enemy, log){
    player.defense += 50;
    log = ` ${player.name} harnesses its massive gravitational pull to greatly increase defense for 3 turns!`
}

export function PlutoSpec(player, enemy, log){
    //money stealin
    log = ` ${player.name} quietly absorbs energy from ${enemy.enemyName}, storing it for later`
}

export function EnemySpec(player, enemy, log){
    const rand = Math.ceil(Math.random() * 5)

    switch(rand){
        case(1):
            player.defense -= 20;
            log = `${player.name}'s defense was lowered by 20!`
            break;
        case(2):
            enemy.defense += 20;
            log = `${enemy.enemyName}'s defense was raised by 20!`
            break;
        case(3):
            player.evasion -= 20;
            log = `${player.name}'s evasion was lowered by 20!`
            break;
        case(4):
            player.attack -= 10;
            log = `${player.name}'s attack was lowered by 20!`
            break;
    }
}

export function UseSpec(player, enemy, log, caster){
    if(caster === player){
        switch(player){
            case(Sol):
                SolSpec(player, enemy, log)
                break;
            case(Gaia):
                SolSpec(player, enemy, log)
                break;
            case(Luna):
                SolSpec(player, enemy, log)
                break;
            case(Jupiter):
                SolSpec(player, enemy, log)
                break;
            case(Uranus):
                SolSpec(player, enemy, log)
                break;
            case(Pluto):
                SolSpec(player, enemy, log)
                break;
        }
    }else{
        EnemySpec(player, enemy, log)
    }
}
