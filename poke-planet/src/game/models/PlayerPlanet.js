import { getStarterPlanet } from '../data/starterPlanets';
import { fetchImageData } from '../../services/nasaService';

async function buildPlanet(starterName, includePlayerState) {
  const starter = getStarterPlanet(starterName);
  const avatar = await fetchImageData(starter.avatar);

  const planet = {
    id: starter.id,
    name: starter.name,
    avatar,
    baseStats: { ...starter.baseStats },
    description: starter.description,
    specialMove: starter.specialMove,
    favoriteElement: starter.favoriteElement,
  };

  if (!includePlayerState) {
    return planet;
  }

  return {
    ...planet,
    affinity: 0,
    currOutfit: [],
  };
}

export function createStarterPlanet(starterName) {
  return buildPlanet(starterName, true);
}

export function fetchPlanetCard(starterName) {
  return buildPlanet(starterName, false);
}