import { fetchExoplanetData } from '../../services/exoplanetService';
import { createEnemy } from '../data/enemies';
import { createBoss } from '../models/BossPlanet';

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

  const enemyPromises = Array.from(
    { length: enemyCount },
    () => createEnemy(exoplanetRecords),
  );

  const [enemies, boss] = await Promise.all([
    Promise.all(enemyPromises),
    createBoss(),
  ]);

  return {
    enemies,
    boss,
  };
}