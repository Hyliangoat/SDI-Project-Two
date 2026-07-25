import {
  BATTLE_STATUS,
  ENEMY_HEAL_LIMIT,
  HEAL_PERCENTAGE,
  PLAYER_HEAL_LIMIT,
  ENEMY_ARCHETYPE,
} from './battleConstants';
import { toFiniteNumber } from './battleUtils';

const PLAYER_ID_BY_NAME = Object.freeze({
  'Sol, Father of the System': 'sol',
  'Gaia, Life-Giver': 'gaia',
  'Luna, Queen of the Tides': 'luna',
  'Jupiter, Bulwark of the Weak': 'jupiter',
  'Sir Anthony Nuss': 'uranus',
  'Pluto, The Outcast': 'pluto',
});

function requireObject(value, label) {
  if (!value || typeof value !== 'object') {
    throw new Error(`${label} is required to start a battle.`);
  }

  return value;
}

export function createPlayerActor(player) {
  requireObject(player, 'Player');
  requireObject(player.baseStats, 'Player base statistics');

  const affinityBonus = Math.max(0, toFiniteNumber(player.affinity)) / 5;
  const maxHealth = Math.max(
    1,
    Math.round(toFiniteNumber(player.baseStats.hp, 1) + affinityBonus),
  );

  return {
    id: player.id ?? PLAYER_ID_BY_NAME[player.name] ?? 'unknown-player',
    name: player.name ?? 'Unknown Planet',
    avatar: player.avatar ?? '',
    specialMove: Array.isArray(player.specialMove)
      ? player.specialMove[0]
      : (player.specialMove ?? 'Special Move'),
    maxHealth,
    health: maxHealth,
    baseStats: {
      attack: Math.max(0, toFiniteNumber(player.baseStats.attack) + affinityBonus),
      defense: Math.max(0, toFiniteNumber(player.baseStats.defense) + affinityBonus),
      evasion: Math.max(0, toFiniteNumber(player.baseStats.evasion) + affinityBonus),
    },
    healsRemaining: PLAYER_HEAL_LIMIT,
    healPercentage: HEAL_PERCENTAGE,
    specialCooldown: 0,
    effects: [],
  };
}

export function createEnemyActor(enemy, { isBoss = false } = {}) {
  requireObject(enemy, isBoss ? 'Boss' : 'Enemy');

  const maxHealth = Math.max(
    1,
    Math.round(
      toFiniteNumber(
        isBoss ? enemy.bossHp : enemy.enemyHp,
        1,
      ),
    ),
  );

  return {
    id:
      enemy.id
      ?? `${isBoss ? 'boss' : 'enemy'}-${
        enemy.enemyName
        ?? enemy.name
        ?? 'unknown'
      }`,

    name:
      enemy.enemyName
      ?? enemy.name
      ?? 'Unknown Rogue Planet',

    avatar: isBoss
      ? (enemy.bossAvatar ?? '')
      : (enemy.enemyAvatar ?? ''),

    specialMove: isBoss
      ? (enemy.bossSpecial ?? 'Boss Special')
      : (enemy.specialMove ?? 'Rogue Anomaly'),

    archetype: isBoss
      ? ENEMY_ARCHETYPE.BOSS
      : (
        enemy.enemyArchetype
        ?? enemy.archetype
        ?? ENEMY_ARCHETYPE.BALANCED
      ),

    threatScore: isBoss
      ? null
      : Math.max(
        0,
        Math.round(
          toFiniteNumber(enemy.threatScore, 0),
        ),
      ),

    sourceData: isBoss
      ? null
      : (
        enemy.sourceData
          ? { ...enemy.sourceData }
          : null
      ),

    maxHealth,
    health: maxHealth,

    baseStats: {
      attack: Math.max(
        0,
        toFiniteNumber(
          isBoss
            ? enemy.bossAttack
            : enemy.enemyAttack,
        ),
      ),

      defense: Math.max(
        0,
        toFiniteNumber(
          isBoss
            ? enemy.bossDefense
            : enemy.enemyDefense,
        ),
      ),

      evasion: Math.max(
        0,
        toFiniteNumber(
          isBoss
            ? enemy.bossEvasion
            : enemy.enemyEvasion,
        ),
      ),
    },

    healsRemaining: ENEMY_HEAL_LIMIT,
    healPercentage: HEAL_PERCENTAGE,
    specialCooldown: 0,
    effects: [],
  };
}

export function createIdleBattleState() {
  return {
    status: BATTLE_STATUS.IDLE,
    player: null,
    enemy: null,
    enemies: [],
    boss: null,
    currentEnemyIndex: 0,
    isBossBattle: false,
    events: [],
    actionId: 0,
    turn: 0,
    pendingReward: 0,
    lastEnemyDecision: null,
  };
}

export function createBattleState({ player, enemies, boss }) {
  if (!Array.isArray(enemies) || enemies.length === 0) {
    throw new Error('At least one campaign enemy is required.');
  }

  requireObject(boss, 'Campaign boss');

  return {
    ...createIdleBattleState(),
    status: BATTLE_STATUS.ACTIVE,
    player: createPlayerActor(player),
    enemy: createEnemyActor(enemies[0]),
    enemies: enemies.map((enemy) => ({ ...enemy })),
    boss: { ...boss },
  };
}