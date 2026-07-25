export const BATTLE_STATUS = Object.freeze({
  IDLE: 'idle',
  ACTIVE: 'active',
  OPPONENT_DEFEATED: 'opponentDefeated',
  DEFEAT: 'defeat',
  CAMPAIGN_COMPLETE: 'campaignComplete',
});

export const BATTLE_ACTION = Object.freeze({
  ATTACK: 'attack',
  EVADE: 'evade',
  HEAL: 'heal',
  SPECIAL: 'special',
});

export const BATTLE_REDUCER_ACTION = Object.freeze({
  START_CAMPAIGN: 'START_CAMPAIGN',
  PLAYER_ACTION: 'PLAYER_ACTION',
  ADVANCE_OPPONENT: 'ADVANCE_OPPONENT',
  CLEAR_EVENTS: 'CLEAR_EVENTS',
  CLAIM_REWARD: 'CLAIM_REWARD',
  RESET_BATTLE: 'RESET_BATTLE',
});

export const ENEMY_ARCHETYPE = Object.freeze({
  BALANCED: 'balanced',
  STRIKER: 'striker',
  BULWARK: 'bulwark',
  SKIRMISHER: 'skirmisher',
  JUGGERNAUT: 'juggernaut',
  BOSS: 'boss',
});

export const ENEMY_SPECIAL = Object.freeze({
  PLAYER_DEFENSE_DOWN: 'player-defense-down',
  ENEMY_DEFENSE_UP: 'enemy-defense-up',
  PLAYER_EVASION_DOWN: 'player-evasion-down',
  PLAYER_ATTACK_DOWN: 'player-attack-down',
});

export const PLAYER_HEAL_LIMIT = 3;
export const ENEMY_HEAL_LIMIT = 2;
export const HEAL_PERCENTAGE = 0.2;
export const EVADE_BONUS = 30;
export const EVADE_DURATION = 3;
export const SPECIAL_COOLDOWN = 5;
export const DEFAULT_RANDOM_VALUE = 0.5;
export const RANDOM_VALUES_PER_TURN = 12;
export const ENEMY_EXPLORATION_RATE = 0.12;

export const EFFECT_ID = Object.freeze({
  PLAYER_EVADE: 'player-evade',
  ENEMY_EVADE: 'enemy-evade',
  LUNA_CLOAK: 'luna-cloak',
  JUPITER_SHIELD: 'jupiter-shield',
  URANUS_WINTER: 'uranus-winter',
  ENEMY_PLAYER_DEFENSE_DOWN: 'enemy-player-defense-down',
  ENEMY_DEFENSE_UP: 'enemy-defense-up',
  ENEMY_PLAYER_EVASION_DOWN: 'enemy-player-evasion-down',
  ENEMY_PLAYER_ATTACK_DOWN: 'enemy-player-attack-down',
});