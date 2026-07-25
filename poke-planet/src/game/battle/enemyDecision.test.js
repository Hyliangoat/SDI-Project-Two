import { describe, expect, it } from 'vitest';
import {
  BATTLE_ACTION,
  EFFECT_ID,
  ENEMY_ARCHETYPE,
} from './battleConstants';
import { chooseEnemyAction, rankEnemyActions } from './enemyDecision';

function createActor(overrides = {}) {
  return {
    id: 'actor',
    name: 'Actor',
    maxHealth: 100,
    health: 100,
    baseStats: {
      attack: 50,
      defense: 30,
      evasion: 10,
    },
    healsRemaining: 2,
    healPercentage: 0.2,
    specialCooldown: 0,
    effects: [],
    archetype: ENEMY_ARCHETYPE.BALANCED,
    ...overrides,
  };
}

describe('enemy decision algorithm', () => {
  it('selects an attack when expected damage can defeat the player', () => {
    const player = createActor({ health: 10, baseStats: { attack: 20, defense: 0, evasion: 0 } });
    const enemy = createActor({ baseStats: { attack: 60, defense: 20, evasion: 0 } });

    const decision = chooseEnemyAction(player, enemy, 0.5);

    expect(decision.action).toBe(BATTLE_ACTION.ATTACK);
    expect(decision.reason).toContain('finish');
  });

  it('selects healing when health is critical and offensive value is low', () => {
    const player = createActor({
      baseStats: { attack: 15, defense: 90, evasion: 80 },
    });
    const enemy = createActor({
      health: 10,
      archetype: ENEMY_ARCHETYPE.JUGGERNAUT,
      baseStats: { attack: 10, defense: 10, evasion: 0 },
      specialCooldown: 4,
    });

    const decision = chooseEnemyAction(player, enemy, 0.5);

    expect(decision.action).toBe(BATTLE_ACTION.HEAL);
  });

  it('excludes actions that are currently invalid', () => {
    const player = createActor();
    const enemy = createActor({
      health: 100,
      healsRemaining: 0,
      specialCooldown: 2,
      effects: [
        {
          id: EFFECT_ID.ENEMY_EVADE,
          stat: 'evasion',
          amount: 30,
          turnsRemaining: 2,
        },
      ],
    });

    const ranked = rankEnemyActions(player, enemy);

    expect(ranked.map((candidate) => candidate.action)).toEqual([
      BATTLE_ACTION.ATTACK,
    ]);
  });

  it('occasionally selects the second-ranked action to preserve variation', () => {
    const player = createActor();
    const enemy = createActor({ health: 40 });

    const highestScoreDecision = chooseEnemyAction(player, enemy, 0.5);
    const explorationDecision = chooseEnemyAction(player, enemy, 0.01);

    expect(explorationDecision.mode).toBe('exploration');
    expect(explorationDecision.action).toBe(
      highestScoreDecision.rankedCandidates[1].action,
    );
  });
});