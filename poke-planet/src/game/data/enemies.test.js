import { describe, expect, it } from "vitest";
import { ENEMY_ARCHETYPE } from "../battle/battleConstants";
import {
  buildEnemyDistributions,
  createEnemies,
  deduplicateExoplanets,
  transformExoplanetToEnemy,
} from "./enemies";

const records = [
  {
    pl_name: "Alpha",
    pl_rade: 0.6,
    st_teff: 3000,
    pl_masse: 1,
    pl_orbper: 2,
  },
  {
    pl_name: "Beta",
    pl_rade: 0.9,
    st_teff: 4000,
    pl_masse: 2,
    pl_orbper: 5,
  },
  {
    pl_name: "Gamma",
    pl_rade: 1.2,
    st_teff: 5000,
    pl_masse: 4,
    pl_orbper: 10,
  },
  {
    pl_name: "Delta",
    pl_rade: 1.5,
    st_teff: 6000,
    pl_masse: 6,
    pl_orbper: 20,
  },
  {
    pl_name: "Epsilon",
    pl_rade: 1.8,
    st_teff: 7000,
    pl_masse: 9,
    pl_orbper: 40,
  },
];

function sequenceRandom(values) {
  let index = 0;
  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe("procedural enemy generation", () => {
  it("deduplicates exoplanets by name and keeps the more complete record", () => {
    const duplicates = [
      { pl_name: "Alpha", pl_rade: 1 },
      { pl_name: "Alpha", pl_rade: 1, st_teff: 5000, pl_masse: 2 },
    ];

    const unique = deduplicateExoplanets(duplicates);

    expect(unique).toHaveLength(1);
    expect(unique[0].st_teff).toBe(5000);
  });

  it("normalizes scientific values into bounded gameplay statistics", () => {
    const distributions = buildEnemyDistributions(records);
    const enemy = transformExoplanetToEnemy(records[4], distributions);

    expect(enemy.enemyHp).toBe(120);
    expect(enemy.enemyAttack).toBe(80);
    expect(enemy.enemyDefense).toBe(70);
    expect(enemy.enemyEvasion).toBe(35);
    expect(enemy.threatScore).toBe(100);
    expect(enemy.enemyArchetype).toBe(ENEMY_ARCHETYPE.BALANCED);
  });

  it("creates unique enemies and orders the campaign by threat score", async () => {
    const enemies = await createEnemies(records, 4, {
      random: sequenceRandom([0.1, 0.8, 0.3, 0.7, 0.2, 0.9, 0.4, 0.6]),
      imageFetcher: async (imageId) => `image:${imageId}`,
    });

    expect(enemies).toHaveLength(4);
    expect(new Set(enemies.map((enemy) => enemy.enemyName)).size).toBe(4);
    expect(new Set(enemies.map((enemy) => enemy.enemyAvatar)).size).toBe(4);
    expect(enemies.map((enemy) => enemy.threatScore)).toEqual(
      [...enemies]
        .map((enemy) => enemy.threatScore)
        .sort((first, second) => first - second),
    );
  });
});
