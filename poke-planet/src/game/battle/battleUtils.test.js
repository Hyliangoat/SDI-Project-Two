import { describe, expect, it } from 'vitest';
import {
  advanceActorTimers,
  calculateDamage,
  didAttackHit,
  healActor,
} from './battleUtils';

function createActor(overrides = {}) {
  return {
    name: 'Test Planet',
    maxHealth: 100,
    health: 50,
    baseStats: { attack: 50, defense: 20, evasion: 10 },
    healsRemaining: 2,
    healPercentage: 0.2,
    specialCooldown: 0,
    effects: [],
    ...overrides,
  };
}

describe('battle utilities', () => {
  it('never returns negative damage when defense exceeds 100', () => {
    expect(calculateDamage(100, 500)).toBe(5);
  });

  it('reduces damage when defense increases', () => {
    expect(calculateDamage(100, 50)).toBe(50);
  });

  it('uses a deterministic random value for hit checks', () => {
    expect(didAttackHit(50, 0.24)).toBe(false);
    expect(didAttackHit(50, 0.74)).toBe(true);
  });

  it('heals without exceeding maximum health', () => {
    const result = healActor(createActor({ health: 95 }));
    expect(result.actor.health).toBe(100);
    expect(result.actor.healsRemaining).toBe(1);
  });

  it('does not consume a heal at full health', () => {
    const result = healActor(createActor({ health: 100 }));
    expect(result.actor.health).toBe(100);
    expect(result.actor.healsRemaining).toBe(2);
  });

  it('expires effects and cooldowns predictably', () => {
    const actor = createActor({
      specialCooldown: 2,
      effects: [
        { id: 'temporary', stat: 'defense', amount: 20, turnsRemaining: 1 },
      ],
    });

    const updated = advanceActorTimers(actor);
    expect(updated.specialCooldown).toBe(1);
    expect(updated.effects).toEqual([]);
  });
});