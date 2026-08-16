import { fetchExoplanetData } from "../../services/exoplanetService";
import { fetchImageData } from '../../services/nasaService'

function assignStats(enemy) {
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

    const balancePatch = (enemyCheck) => {
        let tempPlanet = enemyCheck
        tempPlanet.enemyHp > 100 && (tempPlanet.enemyHp = 100)
        tempPlanet.enemyAttack > 60 && (tempPlanet.enemyAttack = 60)
        tempPlanet.enemyDefense > 50 && (tempPlanet.enemyDefense = 60)
        tempPlanet.enemyEvasion > 25 && (tempPlanet.enemyEvasion = 25)
        return tempPlanet
    }

        let tempPlanet = {...enemyBasePlanet};
        enemy.pl_name ? (tempPlanet.enemyName = enemy.pl_name) : (tempPlanet.enemyName = name)
        enemy.pl_rade ? (tempPlanet.enemyHp = (enemy.pl_rade * 50)) : (tempPlanet.enemyHp = (planRadius * 50))
        enemy.st_teff ? (tempPlanet.enemyAttack = (enemy.st_teff * 0.01)) : (tempPlanet.enemyAttack = (sunTemp * 0.01))
        enemy.pl_masse ? (tempPlanet.enemyDefense = (enemy.pl_masse * 10)) : (tempPlanet.enemyDefense = (mass * 10))
        enemy.pl_orbper ? (tempPlanet.enemyEvasion = (enemy.pl_orbper * 1.5)) : (tempPlanet.enemyEvasion = (orbPeriod * 1.5))

        tempPlanet = balancePatch(tempPlanet)
        tempPlanet.enemyHp = Math.floor(tempPlanet.enemyHp)
        tempPlanet.enemyAttack = Math.floor(tempPlanet.enemyAttack)
        tempPlanet.enemyDefense = Math.floor(tempPlanet.enemyDefense)
        tempPlanet.enemyEvasion = Math.floor(tempPlanet.enemyEvasion)


    return tempPlanet
}



export async function createEnemyImage() {
    const imageArray = [
        'GSFC_20171208_Archive_e002172',
        'PIA26601',
        'PIA10364',
        'PIA21472',
        'PIA19833',
        'PIA13054',
        'PIA22087',
        'PIA23690',
        'PIA22084',
        'PIA14888',
        'PIA15808',
        'PIA23130',
        'PIA10363',
        'GSFC_20171208_Archive_e000132',
        'PIA05566',
        'PIA10246',
        'PIA21752',
        'PIA23684',
        'PIA19344',
        'PIA19346',
        'PIA19824',
        'PIA17307',
        'PIA17801',
        'PIA23004',
        'PIA17004',
        'PIA17002',
        'PIA07854'
    ]
    const rand = Math.floor(Math.random() * (imageArray.length))
    const randPic = imageArray[rand]
    const enemyUrl = await fetchImageData(randPic)
    return enemyUrl
}

export async function createEnemy(){
    const enemyPlanetData = await fetchExoplanetData()
    const enemyImage = await createEnemyImage()
    const randEnemy = Math.floor(Math.random() * 300)
    const finalEnemy = assignStats(enemyPlanetData[randEnemy])
    finalEnemy.enemyAvatar = enemyImage;
    return finalEnemy;
}