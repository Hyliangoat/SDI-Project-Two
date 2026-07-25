import { fetchExoplanetData } from '../../services/exoplanetService';
import { createEnemies } from '../data/enemies';
import { createBoss } from '../models/BossPlanet';

//this function creates a campaign with a specified number of enemies and a boss. It fetches exoplanet data, creates the specified number of enemies using that data, and then creates a boss. The function returns an object containing the enemies and the boss.
export async function createCampaign(enemyCount = 4) {
  if (
    !Number.isInteger(enemyCount) ||
    enemyCount <= 0
  ) {
    throw new Error(
      'Enemy count must be a positive integer.',
    );
  }


  const exoplanetRecords =
    await fetchExoplanetData();


  const [enemies, boss] = await Promise.all([
    createEnemies(exoplanetRecords, enemyCount),
    createBoss(),
  ]);

  return {
    enemies,
    boss,
  };
}