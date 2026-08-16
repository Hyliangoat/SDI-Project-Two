import { EFFECT_ID, ENEMY_SPECIAL, EVADE_DURATION } from "./battleConstants";
import { addOrReplaceEffect, setActorHealth } from "./battleUtils";

function useSolSpecial(player, enemy) {
  const damage = 60;
  return {
    player,
    enemy: setActorHealth(enemy, enemy.health - damage),
    message: `${player.name} releases a solar flare upon ${enemy.name}, dealing ${damage} unblockable damage!`,
  };
}

function useGaiaSpecial(player, enemy) {
  const healing = 100;
  return {
    player: {
      ...player,
      health: player.health + healing,
    },
    enemy,
    message: `${player.name} absorbs energy from a nearby star and heals ${healing} health, even beyond maximum health!`,
  };
}

function useLunaSpecial(player, enemy) {
  return {
    player: addOrReplaceEffect(player, {
      id: EFFECT_ID.LUNA_CLOAK,
      stat: "evasion",
      amount: 50,
      turnsRemaining: EVADE_DURATION,
    }),
    enemy,
    message: `${player.name} cloaks itself in darkness, increasing evasion for ${EVADE_DURATION} turns!`,
  };
}

function useUranusSpecial(player, enemy) {
  return {
    player,
    enemy: addOrReplaceEffect(enemy, {
      id: EFFECT_ID.URANUS_WINTER,
      stat: "defense",
      amount: -50,
      turnsRemaining: EVADE_DURATION,
    }),
    message: `${player.name} unleashes a gale of ice upon ${enemy.name}, lowering its defense for ${EVADE_DURATION} turns!`,
  };
}

function useJupiterSpecial(player, enemy) {
  return {
    player: addOrReplaceEffect(player, {
      id: EFFECT_ID.JUPITER_SHIELD,
      stat: "defense",
      amount: 50,
      turnsRemaining: EVADE_DURATION,
    }),
    enemy,
    message: `${player.name} harnesses its gravity to increase defense for ${EVADE_DURATION} turns!`,
  };
}

function usePlutoSpecial(player, enemy) {
  return {
    player,
    enemy,
    message: `${player.name} quietly absorbs energy from ${enemy.name}, storing it for later.`,
  };
}

const PLAYER_SPECIALS = Object.freeze({
  sol: useSolSpecial,
  gaia: useGaiaSpecial,
  luna: useLunaSpecial,
  uranus: useUranusSpecial,
  jupiter: useJupiterSpecial,
  pluto: usePlutoSpecial,
});

export function applyPlayerSpecial(player, enemy) {
  const handler = PLAYER_SPECIALS[player.id];

  if (!handler) {
    return {
      player,
      enemy,
      message: `${player.name}'s special ability is not configured.`,
    };
  }

  return handler(player, enemy);
}

export function applyEnemySpecial(player, enemy, specialId) {
  switch (specialId) {
    case ENEMY_SPECIAL.PLAYER_DEFENSE_DOWN:
      return {
        player: addOrReplaceEffect(player, {
          id: EFFECT_ID.ENEMY_PLAYER_DEFENSE_DOWN,
          stat: "defense",
          amount: -20,
          turnsRemaining: EVADE_DURATION,
        }),
        enemy,
        message: `${player.name}'s defense was lowered by 20 for ${EVADE_DURATION} turns!`,
      };

    case ENEMY_SPECIAL.ENEMY_DEFENSE_UP:
      return {
        player,
        enemy: addOrReplaceEffect(enemy, {
          id: EFFECT_ID.ENEMY_DEFENSE_UP,
          stat: "defense",
          amount: 20,
          turnsRemaining: EVADE_DURATION,
        }),
        message: `${enemy.name}'s defense was raised by 20 for ${EVADE_DURATION} turns!`,
      };

    case ENEMY_SPECIAL.PLAYER_EVASION_DOWN:
      return {
        player: addOrReplaceEffect(player, {
          id: EFFECT_ID.ENEMY_PLAYER_EVASION_DOWN,
          stat: "evasion",
          amount: -20,
          turnsRemaining: EVADE_DURATION,
        }),
        enemy,
        message: `${player.name}'s evasion was lowered by 20 for ${EVADE_DURATION} turns!`,
      };

    case ENEMY_SPECIAL.PLAYER_ATTACK_DOWN:
    default:
      return {
        player: addOrReplaceEffect(player, {
          id: EFFECT_ID.ENEMY_PLAYER_ATTACK_DOWN,
          stat: "attack",
          amount: -10,
          turnsRemaining: EVADE_DURATION,
        }),
        enemy,
        message: `${player.name}'s attack was lowered by 10 for ${EVADE_DURATION} turns!`,
      };
  }
}
