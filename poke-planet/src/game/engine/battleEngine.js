import React from "react"
let enemyArray = []
let bossEnemy = null;
let currEnemy = 0;
//--------Battle stats----------//
//-----Enemy------//
let enemyStats = {}
let enemyEvadeTimer = 3;
let enemyEvading = false;
let enemyHeals = 2;
let enemyMaxHealth = 0;
let enemyBaseEvasion = 0;
let enemySpecialCooldown = 0;
let enemySpecialCondition = 0
let enemySoftStats = {}
let bossActive = false;
//-----Player----//
let playerStats = {}
let playerEvadeTimer = 3;
let playerEvading = false;
let playerHeals = 3;
let playerMaxHealth = 0;
let playerBaseEvasion = 0;
let playerSpecialCooldown = 0;
let playerSpecialCondition = 0;
let playerSoftStats = {}
//-------Etc-----------//
let specLog = ''

//==================================Initialization===============================================//
export function testing(){
    currEnemy += 1;
    console.log(currEnemy)
}

export function resetRound(){
    enemyEvadeTimer = 3;
    enemyEvading = false;
    enemyHeals = 2;
}
export function intializePlayer(player){
    playerStats.health = (player.baseStats.hp) + (player.affinity / 5)
    playerStats.attack = (player.baseStats.attack) + (player.affinity / 5)
    playerStats.defense = (player.baseStats.defense) + (player.affinity / 5)
    playerStats.evasion = (player.baseStats.evasion) + (player.affinity / 5)
    playerStats.name = (player.name)
    playerMaxHealth = (player.baseStats.hp) + player.affinity
    playerBaseEvasion = (player.baseStats.evasion) + player.affinity

    playerSoftStats.attack = playerStats.attack
    playerSoftStats.defense = playerStats.defense
    playerSoftStats.evasion = playerStats.evasion

}

export function assignEnemies(enemies){
    enemyArray.push(enemies)
}

export function assignBoss(boss){
    bossEnemy = boss;
}

export function getBoss(){
    return bossEnemy;
}

export function requestEnemy(){
    return enemyArray[currEnemy];
}

export function initializeEnemy() {
    enemyStats.health = (enemyArray[currEnemy].enemyHp)
    enemyStats.attack = (enemyArray[currEnemy].enemyAttack)
    enemyStats.defense = (enemyArray[currEnemy].enemyDefense)
    enemyStats.evasion = (enemyArray[currEnemy].enemyEvasion)
    enemyMaxHealth = (enemyArray[currEnemy].enemyHp)
    enemyBaseEvasion = (enemyArray[currEnemy].enemyEvasion)

    enemySoftStats.attack = enemyStats.attack;
    enemySoftStats.defense = enemyStats.defense;
    enemySoftStats.evasion = enemyStats.evasion;
}

export function initializeBoss(){
    enemyStats.health = bossEnemy.bossHp
    enemyStats.attack = bossEnemy.bossAttack
    enemyStats.defense = bossEnemy.bossDefense
    enemyStats.evasion = bossEnemy.bossEvasion
    enemyMaxHealth = bossEnemy.bossHp
    enemyBaseEvasion = bossEnemy.bossEvasion

    enemySoftStats.attack = enemyStats.attack;
    enemySoftStats.defense = enemyStats.defense;
    enemySoftStats.evasion = enemyStats.evasion;
    bossActive = true;
}

export function showHealth(target) {
    if(target === 'enemy'){
        return enemyStats.health
    }else{
        return playerStats.health
    }
}

function statRefresh(){
    if(playerSpecialCondition === 0){
        playerStats.attack = playerSoftStats.attack;
        playerStats.defense = playerSoftStats.defense;
        playerStats.evasion = playerSoftStats.evasion;
    }

    if(enemySpecialCondition === 0){
        enemyStats.attackttack = enemySoftStats.attack
        enemyStats.defense = enemySoftStats.defense
        enemyStats.evasion = enemySoftStats.evasion
    }
}

export function resetAll(){
    enemyArray = []
    bossEnemy = null;
    currEnemy = 0;
    //--------Battle stats----------//
    //-----Enemy------//
    enemyStats = {}
    enemyEvadeTimer = 3;
    enemyEvading = false;
    enemyHeals = 2;
    enemyMaxHealth = 0;
    enemyBaseEvasion = 0;
    enemySpecialCooldown = 0;
    enemySpecialCondition = 0
    enemySoftStats = {}
    bossActive = false;
    //-----Player----//
    playerStats = {}
    playerEvadeTimer = 3;
    playerEvading = false;
    playerHeals = 3;
    playerMaxHealth = 0;
    playerBaseEvasion = 0;
    playerSpecialCooldown = 0;
    playerSpecialCondition = 0;
    playerSoftStats = {}
    //-------Etc-----------//
    specLog = ''
}

//========================================Specials==================================================================//

function SolSpec(player, enemy, log){
    enemyStats.health -= 60;
    specLog = ` ${player.name} releases a solar flare upon ${enemy.enemyName}, ripping their atmosphere apart for 60 unblockable damage!`
}

function GaiaSpec(player, enemy, log){
    playerStats.health += 100;
    specLog = ` ${player.name} begins to absorb energy from their sun, healing 100, even over maximum health!`
}

function LunaSpec(player, enemy, log){
    playerStats.evasion += 50;
    playerSpecialCondition = 3;
    specLog = ` ${player.name} cloaks itself in darkness, greatly increasing evasion for 3 turns!`
}

function AnussSpec(player, enemy, log){
    enemyStats.defense -= 50;
    enemySpecialCondition = 3;
    specLog = ` ${player.name} unleashes a gale of ice upon ${enemy.name}, drastically lowering their defense for 3 turns!`
}

function JupiterSpec(player, enemy, log){
    playerStats.defense += 50;
    playerSpecialCondition = 3;
    specLog = ` ${player.name} harnesses its massive gravitational pull to greatly increase defense for 3 turns!`
}

function PlutoSpec(player, enemy, log){
    //money stealin
    specLog = ` ${player.name} quietly absorbs energy from ${enemy.enemyName}, storing it for later`
}

function EnemySpec(player, enemy, log){
    const rand = Math.ceil(Math.random() * 4)
    switch(rand){
        case(1):
            playerStats.defense -= 20;
            playerSpecialCondition = 3;
            specLog = ` ${playerStats.name}'s defense was lowered by 20!`
            break;
        case(2):
            enemyStats.defense += 20;
            enemySpecialCondition = 3;
            specLog = ` ${enemy.enemyName}'s defense was raised by 20!`
            break;
        case(3):
            playerStats.evasion -= 20;
            playerSpecialCondition = 3;
            specLog = ` ${playerStats.name}'s evasion was lowered by 20!`
            break;
        case(4):
            playerStats.attack -= 10;
            playerSpecialCondition = 3;
            specLog = ` ${playerStats.name}'s attack was lowered by 20!`
            break;
    }
}

function UseSpec(player, enemy, log, caster){
    if(caster === player){
        switch(player.name){
            case('Sol, Father of the System'):
                SolSpec(player, enemy, log)
                break;
            case('Gaia, Life-Giver'):
                GaiaSpec(player, enemy, log)
                break;
            case('Luna, Queen of the Tides'):
                LunaSpec(player, enemy, log)
                break;
            case('Jupiter, Bulwark of the Weak'):
                JupiterSpec(player, enemy, log)
                break;
            case('Sir Anthony Nuss'):
                AnussSpec(player, enemy, log)
                break;
            case('Pluto, The Outcast'):
                PlutoSpec(player, enemy, log)
                break;
        }
    }else{
        EnemySpec(player, enemy, log)
    }
}


//==========================================Battle Sequences=========================================================//

function enemyAttack(){
    let events = []
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }

    events.push(` ${enemy.enemyName} attacked`)

    let damage = enemyStats.attack * ((100 - playerStats.defense) * 0.01)
    const evade = playerStats.evasion
    const rand = Math.ceil(Math.random() * 100)
    damage = Math.ceil(damage)

    if(evade > rand){
        playerStats.health -= 0;
        events.push(` ${enemy.enemyName} missed`)
    }else{
        playerStats.health -= damage
        events.push(` ${enemy.enemyName} did ${damage} damage`)
    }

    return events
}

function enemyEvade(){
    let events = []
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }

    if(enemyEvading === false){
        events.push(` ${enemy.enemyName} evaded for 3 turns`)
        enemyStats.evasion += 30;
        enemyEvading = true;
    }else{
        events.push(` ${enemy.enemyName} is alreddy evading!`)
    }
    return events
}

function enemySpecial(){
    let events = []
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }

    if(enemySpecialCooldown === 0){
        events.push(` ${enemy.enemyName} used a special move!`)
        UseSpec('', enemy, specLog, enemy)
        events.push(specLog)
    }else{
        events.push(` ${enemy.enemyName} can't use that yet!`)
    }
    return events
}

function enemyHeal(){
    let events = []
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }


    if(enemyHeals > 0){
        let healing = enemyMaxHealth * 0.2

        if(healing > (enemyMaxHealth - enemyStats.health)){
            healing = (enemyMaxHealth - enemyStats.health)
        }
        events.push(` ${enemy.enemyName} healed ${healing} health!`)
        enemyStats.health += healing;
        enemyHeals -= 1;
        console.log('enemyheals' + enemyHeals)
    }else{
        events.push(` ${enemy.enemyName} is all out of heals!`)
    }

    return events
}



function enemyChoices(){

    let events = []
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }

    let enemyHealth = enemyStats.health;

    if(enemyHealth < 0){
        events.push(` ${enemy.enemyName} has been slain!`)
        events.push(` A new enemy attacks!`)
        return events
    }
    const randMove = Math.floor(Math.random() * 4)

    switch(randMove){
        case(0):
            events.push(...enemyAttack())
            break;
        case(1):
            events.push(...enemyEvade())
            break;
        case(2):
            events.push(...enemySpecial())
            break;
        case(3):
            events.push(...enemyHeal())
            break;       
        default:
            console.log('We shouldnt be here')
            break;     
    }

    return events
}

function evadeCheck(){
    if(playerEvading === true && playerEvadeTimer > 0){
        playerEvadeTimer -= 1;
    }else{
        playerEvadeTimer = 3;
        playerEvading = false;
        playerStats.evasion = playerBaseEvasion
    }

    if(enemyEvading === true && enemyEvadeTimer > 0){
        enemyEvadeTimer -= 1;
    }else{
        enemyEvadeTimer = 3;
        enemyEvading = false;
        enemyStats.evasion = enemyBaseEvasion
    }
}

function specialCheck(){
    if(playerSpecialCooldown > 0){
        playerSpecialCooldown -= 1
    }

    if(enemySpecialCooldown > 0){
        enemySpecialCooldown -= 1
    }
}

export function attackSequence(player){
    let events = []

    evadeCheck()
    specialCheck()

    events.push(`  ${player.name} attacked`)

    let damage = playerStats.attack * ((100 - enemyStats.defense) * 0.01)
    const evade = enemyStats.evasion
    const rand = Math.ceil(Math.random() * 100)
    damage = Math.ceil(damage)

    if(evade > rand){
        enemyStats.health -= 0;
        events.push(` ${player.name} missed`)
    }else{
        enemyStats.health -= damage
        events.push(` ${player.name} did ${damage} damage`)
    }
    events.push(...enemyChoices())
    events.push(` ${player.name} awaits your command...`)

    return events;
}

export function evadeSequence(player){
    let events = []

    evadeCheck()
    specialCheck()

    if(playerEvading === false){
        events.push(` ${player.name} evaded for 3 turns`)
        playerStats.evasion += 30;
        playerEvading = true;
    }else{
        events.push(` ${player.name} is already evading!`)
    }
    events.push(...enemyChoices())
    events.push(` ${player.name} awaits your command...`)
    return events;
}

export function specialSequence(player){
    let enemy;
    if(bossActive === false){
        enemy = enemyArray[currEnemy]
    }else{
        enemy = bossEnemy
    }
    let events = []
    evadeCheck()
    specialCheck()

    events.push(`  ${player.name} used ${player.specialMove}`)
    if(playerSpecialCooldown === 0){
        UseSpec(player, enemy, specLog, player)
        playerSpecialCooldown = 5;
        events.push(specLog)
    } else{
        events.push(`  ${player.name} can't use that yet!`)
    }
    events.push(...enemyChoices())
    events.push(` ${player.name} awaits your command...`)
    return events;
}

export function healSequence(player){
    let events = []
    evadeCheck()
    specialCheck()
    let healing = playerMaxHealth * 0.20

    if(healing > (playerMaxHealth - playerStats.health)){
        healing = (playerMaxHealth - playerStats.health)
    }
    if(playerHeals > 0){
        events.push(` ${player.name} healed ${healing} health!`)
        playerStats.health += healing;
        playerHeals -= 1;
    }else{
        events.push(` ${player.name} is all out of heals!`)
    }
    events.push(...enemyChoices())
    events.push(` ${player.name} awaits your command...`)
    return events;
}
