import { BossPlanets } from "../data/bosses";
import { fetchImageData } from "../../services/nasaService";

export async function createBoss(){
    let rand = Math.floor(Math.random() * (BossPlanets.length))
    const bossList = [...BossPlanets]
    const currBoss = {...bossList[rand]}
    const bossPic = await fetchImageData(currBoss.bossAvatar)
    currBoss.bossAvatar = bossPic;
    
    return currBoss;
}