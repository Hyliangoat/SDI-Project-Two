import { fetchImageData } from '../../services/nasaService';
import { reservoirSample } from '../algorithms/reservoirSample';
import { percentileRank, sortedFiniteValues, scalePercentile } from '../algorithms/percentile';
import { ENEMY_ARCHETYPE } from '../battle/battleConstants';

//this class defines the default stats for an enemy, the multipliers and limits for each stat, and a list of image IDs that can be used to create enemy avatars. It also includes functions to assign stats to an enemy based on exoplanet data, create an enemy image, and create an enemy using the exoplanet records.

const METRIC_KEYS = Object.freeze({
  health: 'pl_rade',
  attack: 'st_teff',
  defense: 'pl_masse',
  evasion: 'pl_orbper',
});

const STAT_RANGES = Object.freeze({
  health: Object.freeze({ minimum: 60, maximum: 120 }),
  attack: Object.freeze({ minimum: 35, maximum: 80 }),
  defense: Object.freeze({ minimum: 15, maximum: 70 }),
  evasion: Object.freeze({ minimum: 5, maximum: 35 }),
});

const THREAT_WEIGHTS = Object.freeze({
  health: 0.25,
  attack: 0.35,
  defense: 0.25,
  evasion: 0.15,
});

const ARCHETYPE_SPECIALS = new Map([
  [ENEMY_ARCHETYPE.BALANCED, 'Rogue Anomaly'],
  [ENEMY_ARCHETYPE.STRIKER, 'Stellar Overload'],
  [ENEMY_ARCHETYPE.BULWARK, 'Gravity Fortress'],
  [ENEMY_ARCHETYPE.SKIRMISHER, 'Orbital Feint'],
  [ENEMY_ARCHETYPE.JUGGERNAUT, 'Planetary Renewal'],
]);

export const ENEMY_IMAGE_IDS = Object.freeze([
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

function isFiniteMetric(record, key) {
  return Number.isFinite(Number(record?.[key]));
}

function recordCompleteness(record) {
  return Object.values(METRIC_KEYS)
    .filter((key) => isFiniteMetric(record, key))
    .length;
}

export function deduplicateExoplanets(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  const uniqueByName = new Map();

  records.forEach((record) => {
    const name = typeof record?.pl_name === 'string'
      ? record.pl_name.trim()
      : '';

    if (!name || !isFiniteMetric(record, METRIC_KEYS.health)) {
      return;
    }

    const existing = uniqueByName.get(name);

    if (!existing || recordCompleteness(record) > recordCompleteness(existing)) {
      uniqueByName.set(name, record);
    }
  });

  return [...uniqueByName.values()];
}

export function buildEnemyDistributions(records) {
  return Object.fromEntries(
    Object.entries(METRIC_KEYS).map(([statName, metricKey]) => [
      statName,
      sortedFiniteValues(records, metricKey),
    ]),
  );
}

function statPercentiles(record, distributions) {
  return Object.fromEntries(
    Object.entries(METRIC_KEYS).map(([statName, metricKey]) => [
      statName,
      percentileRank(distributions[statName], record?.[metricKey]),
    ]),
  );
}

export function classifyEnemyArchetype(percentiles) {
  const ranked = Object.entries(percentiles)
    .sort((first, second) => second[1] - first[1]);

  if (ranked.length < 2 || ranked[0][1] - ranked[1][1] < 0.08) {
    return ENEMY_ARCHETYPE.BALANCED;
  }

  const [dominantStat] = ranked[0];

  switch (dominantStat) {
    case 'attack':
      return ENEMY_ARCHETYPE.STRIKER;
    case 'defense':
      return ENEMY_ARCHETYPE.BULWARK;
    case 'evasion':
      return ENEMY_ARCHETYPE.SKIRMISHER;
    case 'health':
      return ENEMY_ARCHETYPE.JUGGERNAUT;
    default:
      return ENEMY_ARCHETYPE.BALANCED;
  }
}

function calculateThreatScore(percentiles) {
  const weightedScore = Object.entries(THREAT_WEIGHTS)
    .reduce(
      (total, [statName, weight]) => total + percentiles[statName] * weight,
      0,
    );

  return Math.round(weightedScore * 100);
}

export function transformExoplanetToEnemy(record, distributions) {
  const percentiles = statPercentiles(record, distributions);
  const archetype = classifyEnemyArchetype(percentiles);

  return {
    id: `exoplanet-${String(record.pl_name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    enemyName: record.pl_name,
    enemyHp: scalePercentile(
      percentiles.health,
      STAT_RANGES.health.minimum,
      STAT_RANGES.health.maximum,
    ),
    enemyAttack: scalePercentile(
      percentiles.attack,
      STAT_RANGES.attack.minimum,
      STAT_RANGES.attack.maximum,
    ),
    enemyDefense: scalePercentile(
      percentiles.defense,
      STAT_RANGES.defense.minimum,
      STAT_RANGES.defense.maximum,
    ),
    enemyEvasion: scalePercentile(
      percentiles.evasion,
      STAT_RANGES.evasion.minimum,
      STAT_RANGES.evasion.maximum,
    ),
    enemyArchetype: archetype,
    specialMove: ARCHETYPE_SPECIALS.get(archetype),
    threatScore: calculateThreatScore(percentiles),
    sourceData: {
      radiusEarth: Number(record.pl_rade) || null,
      stellarTemperatureKelvin: Number(record.st_teff) || null,
      massEarth: Number(record.pl_masse) || null,
      orbitalPeriodDays: Number(record.pl_orbper) || null,
    },
  };
}

export async function createEnemies(
  exoplanetRecords,
  enemyCount,
  {
    random = Math.random,
    imageFetcher = fetchImageData,
  } = {},
) {
  if (!Number.isInteger(enemyCount) || enemyCount <= 0) {
    throw new RangeError('Enemy count must be a positive integer.');
  }

  const uniqueRecords = deduplicateExoplanets(exoplanetRecords);

  if (uniqueRecords.length < enemyCount) {
    throw new Error(
      `At least ${enemyCount} unique exoplanet records are required.`,
    );
  }

  const distributions = buildEnemyDistributions(uniqueRecords);
  const selectedRecords = reservoirSample(uniqueRecords, enemyCount, random);
  const selectedImageIds = reservoirSample(
    [...ENEMY_IMAGE_IDS],
    enemyCount,
    random,
  );

  const enemies = await Promise.all(
    selectedRecords.map(async (record, index) => ({
      ...transformExoplanetToEnemy(record, distributions),
      enemyAvatar: await imageFetcher(selectedImageIds[index]),
    })),
  );

  return enemies.sort((first, second) => (
    first.threatScore - second.threatScore
  ));
}
