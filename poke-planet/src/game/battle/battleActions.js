import {
  BATTLE_ACTION,
  BATTLE_STATUS,
  EFFECT_ID,
  EVADE_BONUS,
  EVADE_DURATION,
  SPECIAL_COOLDOWN,
} from './battleConstants';
import {
  addOrReplaceEffect,
  advanceActorTimers,
  calculateDamage,
  createRandomSource,
  didAttackHit,
  getEffectiveStat,
  hasEffect,
  healActor,
  setActorHealth,
} from './battleUtils';
import { chooseEnemyAction } from './enemyDecision';
import { applyEnemySpecial, applyPlayerSpecial } from './specialAbilities';
import { createEnemyActor } from './createBattleState';

function resolveAttack(attacker, defender, nextRandom) {
  const attack = getEffectiveStat(attacker, 'attack');
  const defense = getEffectiveStat(defender, 'defense');
  const evasion = getEffectiveStat(defender, 'evasion');
  const hit = didAttackHit(evasion, nextRandom());

  if (!hit) {
    return {
      defender,
      events: [`${attacker.name} attacked.`, `${attacker.name} missed!`],
    };
  }

  const damage = calculateDamage(attack, defense);
  return {
    defender: setActorHealth(defender, defender.health - damage),
    events: [
      `${attacker.name} attacked.`,
      `${attacker.name} dealt ${damage} damage.`,
    ],
  };
}

function resolveEvade(actor, effectId) {
  if (hasEffect(actor, effectId)) {
    return {
      actor,
      message: `${actor.name} is already evading!`,
    };
  }

  return {
    actor: addOrReplaceEffect(actor, {
      id: effectId,
      stat: 'evasion',
      amount: EVADE_BONUS,
      turnsRemaining: EVADE_DURATION,
    }),
    message: `${actor.name} increased evasion for ${EVADE_DURATION} turns!`,
  };
}

function resolvePlayerAction(player, enemy, actionName, nextRandom) {
  switch (actionName) {
    case BATTLE_ACTION.ATTACK: {
      const result = resolveAttack(player, enemy, nextRandom);
      return { player, enemy: result.defender, events: result.events };
    }
    case BATTLE_ACTION.EVADE: {
      const result = resolveEvade(player, EFFECT_ID.PLAYER_EVADE);
      return { player: result.actor, enemy, events: [result.message] };
    }
    case BATTLE_ACTION.HEAL: {
      const result = healActor(player);
      return { player: result.actor, enemy, events: [result.message] };
    }
    case BATTLE_ACTION.SPECIAL: {
      if (player.specialCooldown > 0) {
        return {
          player,
          enemy,
          events: [
            `${player.name} cannot use ${player.specialMove} for ${player.specialCooldown} more turn(s).`,
          ],
        };
      }

      const result = applyPlayerSpecial(player, enemy);
      return {
        player: {
          ...result.player,
          specialCooldown: SPECIAL_COOLDOWN,
        },
        enemy: result.enemy,
        events: [
          `${player.name} used ${player.specialMove}!`,
          result.message,
        ],
      };
    }
    default:
      return {
        player,
        enemy,
        events: ['The selected player action was not recognized.'],
      };
  }
}

function resolveEnemyAction(player, enemy, nextRandom) {
  const choice = Math.floor(nextRandom() * 4);

  switch (decision.action) {
    case BATTLE_ACTION.ATTACK: {
      const result = resolveAttack(enemy, player, nextRandom);
      return {
        player: result.defender,
        enemy,
        events: result.events,
        decision,
      };
    }

    case BATTLE_ACTION.EVADE: {
      const result = resolveEvade(enemy, EFFECT_ID.ENEMY_EVADE);
      return {
        player,
        enemy: result.actor,
        events: [result.message],
        decision,
      };
    }

    case BATTLE_ACTION.HEAL: {
      const result = healActor(enemy);
      return {
        player,
        enemy: result.actor,
        events: [result.message],
        decision,
      };
    }

    case BATTLE_ACTION.SPECIAL: {
      const result = applyEnemySpecial(player, enemy, decision.specialId);
      return {
        player: result.player,
        enemy: {
          ...result.enemy,
          specialCooldown: SPECIAL_COOLDOWN,
        },
        events: [`${enemy.name} used ${enemy.specialMove}!`, result.message],
        decision,
      };
    }

    default: {
      const result = resolveAttack(enemy, player, nextRandom);
      return {
        player: result.defender,
        enemy,
        events: result.events,
        decision: {
          ...decision,
          action: BATTLE_ACTION.ATTACK,
          reason: 'The decision engine returned an invalid action, so attack was used.',
        },
      };
    }
  }
}

export function resolveTurn(state, actionName, randomValues = []) {
  if (state.status !== BATTLE_STATUS.ACTIVE || !state.player || !state.enemy) {
    return state;
  }

  const nextRandom = createRandomSource(randomValues);
  let player = advanceActorTimers(state.player);
  let enemy = advanceActorTimers(state.enemy);

  const playerResult = resolvePlayerAction(
    player,
    enemy,
    actionName,
    nextRandom,
  );

  player = playerResult.player;
  enemy = playerResult.enemy;
  const events = [...playerResult.events];

  if (enemy.health <= 0) {
    events.push(`${enemy.name} has been defeated!`);

    return {
      ...state,
      player,
      enemy,
      status: state.isBossBattle
        ? BATTLE_STATUS.CAMPAIGN_COMPLETE
        : BATTLE_STATUS.OPPONENT_DEFEATED,
      events,
      actionId: state.actionId + 1,
      turn: state.turn + 1,
      pendingReward: state.isBossBattle ? 100 : 20,
      lastEnemyDecision: null,
    };
  }

  const enemyResult = resolveEnemyAction(player, enemy, nextRandom);
  player = enemyResult.player;
  enemy = enemyResult.enemy;
  events.push(...enemyResult.events);

  if (player.health <= 0) {
    events.push(`${player.name} has been defeated.`);

    return {
      ...state,
      player,
      enemy,
      status: BATTLE_STATUS.DEFEAT,
      events,
      actionId: state.actionId + 1,
      turn: state.turn + 1,
    };
  }

  events.push(`${player.name} awaits your command...`);

  return {
    ...state,
    player,
    enemy,
    status: BATTLE_STATUS.ACTIVE,
    events,
    actionId: state.actionId + 1,
    turn: state.turn + 1,
    lastEnemyDecision: enemyResult.decision,
  };
}

export function advanceOpponent(state) {
  if (state.status !== BATTLE_STATUS.OPPONENT_DEFEATED) {
    return state;
  }

  const nextEnemyIndex = state.currentEnemyIndex + 1;
  const nextIsBoss = nextEnemyIndex >= state.enemies.length;
  const nextEnemy = nextIsBoss
    ? createEnemyActor(state.boss, { isBoss: true })
    : createEnemyActor(state.enemies[nextEnemyIndex]);

  return {
    ...state,
    status: BATTLE_STATUS.ACTIVE,
    enemy: nextEnemy,
    currentEnemyIndex: nextEnemyIndex,
    isBossBattle: nextIsBoss,
    events: [],
    pendingReward: 0,
    lastEnemyDecision: null,
  };
}