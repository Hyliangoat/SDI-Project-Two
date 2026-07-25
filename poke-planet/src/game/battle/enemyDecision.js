import { BinaryMaxHeap } from '../algorithms/BinaryMaxHeap';
import {
  BATTLE_ACTION,
  EFFECT_ID,
  ENEMY_ARCHETYPE,
  ENEMY_EXPLORATION_RATE,
  ENEMY_SPECIAL,
  EVADE_BONUS,
  EVADE_DURATION,
} from './battleConstants';
import {
  calculateDamage,
  clamp,
  getEffectiveStat,
  hasEffect,
  toFiniteNumber,
} from './battleUtils';

const ACTION_TIE_PRIORITY = Object.freeze({
  [BATTLE_ACTION.ATTACK]: 4,
  [BATTLE_ACTION.SPECIAL]: 3,
  [BATTLE_ACTION.HEAL]: 2,
  [BATTLE_ACTION.EVADE]: 1,
});

const ARCHETYPE_WEIGHTS = Object.freeze({
  [ENEMY_ARCHETYPE.BALANCED]: Object.freeze({
    attack: 1,
    evade: 1,
    heal: 1,
    special: 1,
  }),
  [ENEMY_ARCHETYPE.STRIKER]: Object.freeze({
    attack: 1.22,
    evade: 0.88,
    heal: 0.9,
    special: 1.08,
  }),
  [ENEMY_ARCHETYPE.BULWARK]: Object.freeze({
    attack: 0.92,
    evade: 1.12,
    heal: 1.08,
    special: 1.2,
  }),
  [ENEMY_ARCHETYPE.SKIRMISHER]: Object.freeze({
    attack: 1.02,
    evade: 1.28,
    heal: 0.9,
    special: 1.1,
  }),
  [ENEMY_ARCHETYPE.JUGGERNAUT]: Object.freeze({
    attack: 1,
    evade: 0.85,
    heal: 1.3,
    special: 1.08,
  }),
  [ENEMY_ARCHETYPE.BOSS]: Object.freeze({
    attack: 1.12,
    evade: 1,
    heal: 1.05,
    special: 1.35,
  }),
});

function compareCandidates(first, second) {
  const scoreDifference = first.score - second.score;

  if (Math.abs(scoreDifference) > Number.EPSILON) {
    return scoreDifference;
  }

  return (
    ACTION_TIE_PRIORITY[first.action]
    - ACTION_TIE_PRIORITY[second.action]
  );
}

function healthRatio(actor) {
  const maximum = Math.max(1, toFiniteNumber(actor?.maxHealth, 1));
  return clamp(toFiniteNumber(actor?.health), 0, maximum) / maximum;
}

function hitProbability(evasion) {
  return clamp(1 - toFiniteNumber(evasion) / 100, 0.01, 1);
}

function expectedDamage(attacker, defender) {
  const attack = getEffectiveStat(attacker, 'attack');
  const defense = getEffectiveStat(defender, 'defense');
  const evasion = getEffectiveStat(defender, 'evasion');

  return calculateDamage(attack, defense) * hitProbability(evasion);
}

function scoreAttack(player, enemy) {
  const damage = expectedDamage(enemy, player);
  const lethalBonus = damage >= player.health ? 1000 : 0;
  const pressureBonus = (1 - healthRatio(player)) * 20;

  return {
    action: BATTLE_ACTION.ATTACK,
    score: damage + lethalBonus + pressureBonus,
    reason: lethalBonus > 0
      ? 'Attack can finish the player.'
      : `Attack has about ${Math.round(damage)} expected damage.`,
  };
}

function scoreHeal(enemy) {
  const missingHealth = Math.max(0, enemy.maxHealth - enemy.health);

  if (enemy.healsRemaining <= 0 || missingHealth <= 0) {
    return null;
  }

  const healAmount = Math.min(
    enemy.maxHealth * enemy.healPercentage,
    missingHealth,
  );
  const urgencyMultiplier = 1 + (1 - healthRatio(enemy)) * 2.5;
  const conservationPenalty = healthRatio(enemy) > 0.7 ? 0.25 : 1;

  return {
    action: BATTLE_ACTION.HEAL,
    score: healAmount * urgencyMultiplier * conservationPenalty,
    reason: `Healing restores about ${Math.ceil(healAmount)} health.`,
  };
}

function scoreEvade(player, enemy) {
  if (hasEffect(enemy, EFFECT_ID.ENEMY_EVADE)) {
    return null;
  }

  const incomingDamage = calculateDamage(
    getEffectiveStat(player, 'attack'),
    getEffectiveStat(enemy, 'defense'),
  );
  const currentEvasion = getEffectiveStat(enemy, 'evasion');
  const currentHitChance = hitProbability(currentEvasion);
  const improvedHitChance = hitProbability(currentEvasion + EVADE_BONUS);
  const preventedDamage = (
    incomingDamage
    * Math.max(0, currentHitChance - improvedHitChance)
    * EVADE_DURATION
  );
  const dangerMultiplier = 1 + (1 - healthRatio(enemy)) * 1.5;

  return {
    action: BATTLE_ACTION.EVADE,
    score: preventedDamage * dangerMultiplier,
    reason: `Evade may prevent about ${Math.round(preventedDamage)} damage.`,
  };
}

function scorePlayerDefenseDown(player, enemy) {
  const currentDamage = expectedDamage(enemy, player);
  const loweredDefensePlayer = {
    ...player,
    baseStats: {
      ...player.baseStats,
      defense: Math.max(0, getEffectiveStat(player, 'defense') - 20),
    },
    effects: [],
  };
  const improvedDamage = expectedDamage(enemy, loweredDefensePlayer);

  return {
    id: ENEMY_SPECIAL.PLAYER_DEFENSE_DOWN,
    score: (improvedDamage - currentDamage) * EVADE_DURATION + 5,
    reason: 'Lowering player defense improves later attacks.',
  };
}

function scoreEnemyDefenseUp(player, enemy) {
  const currentIncoming = expectedDamage(player, enemy);
  const fortifiedEnemy = {
    ...enemy,
    baseStats: {
      ...enemy.baseStats,
      defense: getEffectiveStat(enemy, 'defense') + 20,
    },
    effects: [],
  };
  const fortifiedIncoming = expectedDamage(player, fortifiedEnemy);

  return {
    id: ENEMY_SPECIAL.ENEMY_DEFENSE_UP,
    score: (currentIncoming - fortifiedIncoming) * EVADE_DURATION + 5,
    reason: 'Increasing defense reduces future player damage.',
  };
}

function scorePlayerEvasionDown(player, enemy) {
  const damage = calculateDamage(
    getEffectiveStat(enemy, 'attack'),
    getEffectiveStat(player, 'defense'),
  );
  const currentHitChance = hitProbability(getEffectiveStat(player, 'evasion'));
  const loweredHitChance = hitProbability(
    Math.max(0, getEffectiveStat(player, 'evasion') - 20),
  );

  return {
    id: ENEMY_SPECIAL.PLAYER_EVASION_DOWN,
    score: damage * (loweredHitChance - currentHitChance) * EVADE_DURATION + 5,
    reason: 'Lowering evasion increases the chance of future hits.',
  };
}

function scorePlayerAttackDown(player, enemy) {
  const currentIncoming = expectedDamage(player, enemy);
  const weakenedPlayer = {
    ...player,
    baseStats: {
      ...player.baseStats,
      attack: Math.max(0, getEffectiveStat(player, 'attack') - 10),
    },
    effects: [],
  };
  const weakenedIncoming = expectedDamage(weakenedPlayer, enemy);

  return {
    id: ENEMY_SPECIAL.PLAYER_ATTACK_DOWN,
    score: (currentIncoming - weakenedIncoming) * EVADE_DURATION + 5,
    reason: 'Lowering attack reduces future incoming damage.',
  };
}

export function chooseEnemySpecial(player, enemy) {
  const candidates = [
    scorePlayerDefenseDown(player, enemy),
    scoreEnemyDefenseUp(player, enemy),
    scorePlayerEvasionDown(player, enemy),
    scorePlayerAttackDown(player, enemy),
  ];

  return candidates.reduce((best, candidate) => (
    !best || candidate.score > best.score ? candidate : best
  ), null);
}

function scoreSpecial(player, enemy) {
  if (enemy.specialCooldown > 0) {
    return null;
  }

  const special = chooseEnemySpecial(player, enemy);

  return {
    action: BATTLE_ACTION.SPECIAL,
    score: special.score,
    reason: special.reason,
    specialId: special.id,
  };
}

export function rankEnemyActions(player, enemy) {
  const weights = ARCHETYPE_WEIGHTS[enemy.archetype]
    ?? ARCHETYPE_WEIGHTS[ENEMY_ARCHETYPE.BALANCED];
  const rawCandidates = [
    scoreAttack(player, enemy),
    scoreEvade(player, enemy),
    scoreHeal(enemy),
    scoreSpecial(player, enemy),
  ].filter(Boolean);

  const heap = new BinaryMaxHeap(compareCandidates);

  rawCandidates.forEach((candidate) => {
    heap.insert({
      ...candidate,
      score: candidate.score * (weights[candidate.action] ?? 1),
    });
  });

  return heap.toSortedArray();
}

export function chooseEnemyAction(player, enemy, randomValue = 0.5) {
  const rankedCandidates = rankEnemyActions(player, enemy);

  if (rankedCandidates.length === 0) {
    return {
      action: BATTLE_ACTION.ATTACK,
      score: 0,
      reason: 'Attack is the only available fallback action.',
      rankedCandidates: [],
    };
  }

  const normalizedRandom = clamp(toFiniteNumber(randomValue, 0.5), 0, 0.999999);
  const shouldExplore = (
    normalizedRandom < ENEMY_EXPLORATION_RATE
    && rankedCandidates.length > 1
  );
  const selected = shouldExplore
    ? rankedCandidates[1]
    : rankedCandidates[0];

  return {
    ...selected,
    mode: shouldExplore ? 'exploration' : 'highest-score',
    rankedCandidates,
  };
}