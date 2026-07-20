import { fetchImageData } from '../../services/nasaService';

const DEFAULT_ENEMY = Object.freeze({
  enemyName: 'Rogue Mystery',
  enemyHp: 75,
  enemyAttack: 55,
  enemyDefense: 30,
  enemyEvasion: 13,
});

const STAT_MULTIPLIERS = Object.freeze({
  health: 50,
  attack: 0.01,
  defense: 10,
  evasion: 1.5,
});

const STAT_LIMITS = Object.freeze({
  health: 100,
  attack: 60,
  defense: 60,
  evasion: 25,
});

const ENEMY_IMAGE_IDS = Object.freeze([
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
  'PIA07854',
]);

function finiteOrFallback(value, fallback) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.min(
    Math.max(value, minimum),
    maximum,
  );
}

function assignStats(record) {
  const health =
    finiteOrFallback(record?.pl_rade, 1.5) *
    STAT_MULTIPLIERS.health;

  const attack =
    finiteOrFallback(record?.st_teff, 5500) *
    STAT_MULTIPLIERS.attack;

  const defense =
    finiteOrFallback(record?.pl_masse, 3) *
    STAT_MULTIPLIERS.defense;

  const evasion =
    finiteOrFallback(record?.pl_orbper, 9) *
    STAT_MULTIPLIERS.evasion;

  return {
    enemyName:
      typeof record?.pl_name === 'string' &&
      record.pl_name.trim()
        ? record.pl_name
        : DEFAULT_ENEMY.enemyName,

    enemyHp: Math.floor(
      clamp(
        health,
        1,
        STAT_LIMITS.health,
      ),
    ),

    enemyAttack: Math.floor(
      clamp(
        attack,
        1,
        STAT_LIMITS.attack,
      ),
    ),

    enemyDefense: Math.floor(
      clamp(
        defense,
        0,
        STAT_LIMITS.defense,
      ),
    ),

    enemyEvasion: Math.floor(
      clamp(
        evasion,
        0,
        STAT_LIMITS.evasion,
      ),
    ),
  };
}

export async function createEnemyImage() {
  const randomIndex = Math.floor(
    Math.random() * ENEMY_IMAGE_IDS.length,
  );

  const imageId = ENEMY_IMAGE_IDS[randomIndex];

  return fetchImageData(imageId);
}

export async function createEnemy(exoplanetRecords) {
  if (
    !Array.isArray(exoplanetRecords) ||
    exoplanetRecords.length === 0
  ) {
    throw new Error(
      'No exoplanet records were available to create an enemy.',
    );
  }

  const randomIndex = Math.floor(
    Math.random() * exoplanetRecords.length,
  );

  const enemy = assignStats(
    exoplanetRecords[randomIndex],
  );

  const enemyAvatar = await createEnemyImage();

  return {
    ...enemy,
    enemyAvatar,
  };
}