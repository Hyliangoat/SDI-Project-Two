import { Sol, Luna, Gaia, Jupiter, Pluto, Uranus } from "../data/starterPlanets"
import { fetchImageData } from "../../services/nasaService"

export async function createStarterPlanet(starter){
    
    switch(starter){
        case('Sol'):
            starter = Sol
            break;
        case('Gaia'):
            starter = Gaia
            break;
        case('Uranus'):
            starter = Uranus
            break;
        case('Jupiter'):
            starter = Jupiter
            break;
        case('Luna'):
            starter = Luna
            break;
        case('Pluto'):
            starter = Pluto
            break;
    }

    const avatar = await fetchImageData(starter.avatar)


    const playerPlanet = {
        name: starter.name,
        avatar: avatar,
        baseStats: {...starter.baseStats},
        description: starter.description,
        specialMove: starter.specialMove,
        favoriteElement: starter.favoriteElement,
        affinity: 0,
        currOutfit: []
    }

    return playerPlanet;
}

export async function fetchPlanetCard(starter){

    switch(starter){
        case('Sol'):
            starter = Sol
            break;
        case('Gaia'):
            starter = Gaia
            break;
        case('Uranus'):
            starter = Uranus
            break;
        case('Jupiter'):
            starter = Jupiter
            break;
        case('Luna'):
            starter = Luna
            break;
        case('Pluto'):
            starter = Pluto
            break;
    }

    const avatar = await fetchImageData(starter.avatar)

    return {
        name: starter.name,
        avatar: avatar,
        baseStats: starter.baseStats,
        description: starter.description,
        specialMove: starter.specialMove
    }
}



