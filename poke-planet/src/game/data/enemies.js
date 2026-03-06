import { fetchExoplanetData } from "../../services/exoplanetService";

function assignStats(enemies) {
    const enemyBasePlanet = {
        enemyName: 'Default',
        enemyHp: 0,
        enemyAttack: 0,
        enemyDefense: 0,
        enemyEvasion: 0
    }

    const name = 'Rogue Mystery';
    const mass = 3;
    const planRadius = 1.5;
    const sunTemp = 5500; //Name, mass, orbital period, radius, sun temp
    const orbPeriod = 9;
    const enemyPlanetArray = [];

    const balancePatch = (enemyCheck) => {
        let tempPlanet = enemyCheck
        tempPlanet.enemyHp > 100 && (tempPlanet.enemyHp = 100)
        tempPlanet.enemyAttack > 60 && (tempPlanet.enemyAttack = 60)
        tempPlanet.enemyDefense > 50 && (tempPlanet.enemyDefense = 60)
        tempPlanet.enemyEvasion > 25 && (tempPlanet.enemyEvasion = 25)
        return tempPlanet
    }

    enemies.map(enemy => {
        let tempPlanet = {...enemyBasePlanet};
        console.log(`mapping ${enemy.pl_name} to ${tempPlanet.enemyName}, ${enemyBasePlanet.enemyName} should not change`)
        enemy.pl_name ? (tempPlanet.enemyName = enemy.pl_name) : (tempPlanet.enemyName = name)
        enemy.pl_rade ? (tempPlanet.enemyHp = (enemy.pl_rade * 50)) : (tempPlanet.enemyHp = (planRadius * 50))
        enemy.st_teff ? (tempPlanet.enemyAttack = (enemy.st_teff * 0.01)) : (tempPlanet.enemyAttack = (sunTemp * 0.01))
        enemy.pl_masse ? (tempPlanet.enemyDefense = (enemy.pl_masse * 10)) : (tempPlanet.enemyDefense = (mass * 10))
        enemy.pl_orbper ? (tempPlanet.enemyEvasion = (enemy.pl_orbper * 1.5)) : (tempPlanet.enemyEvasion = (orbPeriod * 1.5))

        tempPlanet = balancePatch(tempPlanet)
        enemyPlanetArray.push(tempPlanet)
    })



    console.log(enemyPlanetArray)
}


export async function createEnemyList(){
    const enemyPlanetsData = await fetchExoplanetData()
    const enemyPlanets = []
    for(let i = 0; i < 4; i++){
        const rand = Math.floor(Math.random() * (100))
        console.log(rand)
        enemyPlanets.push(enemyPlanetsData[rand])
    }
    console.log(enemyPlanets)
    
    assignStats(enemyPlanets)

}