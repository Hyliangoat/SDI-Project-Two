import { DEFAULT_RANDOM_VALUE } from './battleConstants';

export function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function calculateDamage(attack, defense) {
  const safeAttack = Math.max(0, toFiniteNumber(attack));
  const safeDefense = clamp(toFiniteNumber(defense), 0, 95);
  const damage = safeAttack * (1 - safeDefense / 100);

  return Math.max(0, Math.ceil(damage - 1e-9));
}

export function createRandomSource(values = []) {
  let index = 0;

  return function nextRandom() {
    const value = values[index] ?? DEFAULT_RANDOM_VALUE;
    index += 1;
    return clamp(toFiniteNumber(value, DEFAULT_RANDOM_VALUE), 0, 0.999999);
  };
}

export function didAttackHit(evasion, randomValue) {
  const safeEvasion = clamp(toFiniteNumber(evasion), 0, 100);
  const roll = Math.floor(clamp(randomValue, 0, 0.999999) * 100) + 1;
  return safeEvasion <= roll;
}

export function getEffectiveStat(actor, statName) {
  const baseValue = toFiniteNumber(actor?.baseStats?.[statName]);
  const modifier = (actor?.effects ?? [])
    .filter((effect) => effect.stat === statName)
    .reduce((total, effect) => total + toFiniteNumber(effect.amount), 0);

  return Math.max(0, baseValue + modifier);
}

export function hasEffect(actor, effectId) {
  return (actor?.effects ?? []).some((effect) => effect.id === effectId);
}

export function addOrReplaceEffect(actor, effect) {
  return {
    ...actor,
    effects: [
      ...(actor.effects ?? []).filter((existing) => existing.id !== effect.id),
      effect,
    ],
  };
}

export function advanceActorTimers(actor) {
  return {
    ...actor,
    specialCooldown: Math.max(0, toFiniteNumber(actor.specialCooldown) - 1),
    effects: (actor.effects ?? [])
      .map((effect) => ({
        ...effect,
        turnsRemaining: toFiniteNumber(effect.turnsRemaining) - 1,
      }))
      .filter((effect) => effect.turnsRemaining > 0),
  };
}

export function setActorHealth(actor, health) {
  return {
    ...actor,
    health: clamp(toFiniteNumber(health), 0, Math.max(actor.maxHealth, health)),
  };
}

export function healActor(actor) {
  if (actor.healsRemaining <= 0) {
    return {
      actor,
      amount: 0,
      message: `${actor.name} is all out of heals!`,
    };
  }

  const missingHealth = Math.max(0, actor.maxHealth - actor.health);
  if (missingHealth === 0) {
    return {
      actor,
      amount: 0,
      message: `${actor.name} is already at full health!`,
    };
  }

  const healingAmount = Math.ceil(
    Math.min(actor.maxHealth * actor.healPercentage, missingHealth),
  );

  return {
    actor: {
      ...actor,
      health: actor.health + healingAmount,
      healsRemaining: actor.healsRemaining - 1,
    },
    amount: healingAmount,
    message: `${actor.name} healed ${healingAmount} health!`,
  };
}