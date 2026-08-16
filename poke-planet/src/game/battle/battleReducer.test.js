import { describe, expect, it } from "vitest";
import { battleReducer } from "./battleReducer";
import {
  BATTLE_ACTION,
  BATTLE_REDUCER_ACTION,
  BATTLE_STATUS,
} from "./battleConstants";
import { createBattleState } from "./createBattleState";

const player = {
  id: "sol",
  name: "Sol, Father of the System",
  avatar: "sol.png",
  affinity: 0,
  specialMove: "Solar Flare",
  baseStats: { hp: 100, attack: 100, defense: 30, evasion: 25 },
};

const enemies = [
  {
    enemyName: "Enemy One",
    enemyAvatar: "one.png",
    enemyHp: 100,
    enemyAttack: 20,
    enemyDefense: 0,
    enemyEvasion: 0,
  },
  {
    enemyName: "Enemy Two",
    enemyAvatar: "two.png",
    enemyHp: 120,
    enemyAttack: 25,
    enemyDefense: 10,
    enemyEvasion: 5,
  },
];

const boss = {
  enemyName: "Final Boss",
  name: "Final Boss",
  bossAvatar: "boss.png",
  bossHp: 300,
  bossAttack: 70,
  bossDefense: 40,
  bossEvasion: 10,
  bossSpecial: "Devastate",
};

describe("battle reducer", () => {
  it("creates independent battle state objects", () => {
    const first = createBattleState({ player, enemies, boss });
    const second = createBattleState({ player, enemies, boss });

    first.player.health = 1;
    expect(second.player.health).toBe(100);
  });

  it("treats exactly zero health as defeated", () => {
    const initial = createBattleState({ player, enemies, boss });
    const result = battleReducer(initial, {
      type: BATTLE_REDUCER_ACTION.PLAYER_ACTION,
      payload: {
        actionName: BATTLE_ACTION.ATTACK,
        randomValues: [0.99],
      },
    });

    expect(result.enemy.health).toBe(0);
    expect(result.status).toBe(BATTLE_STATUS.OPPONENT_DEFEATED);
    expect(result.pendingReward).toBe(20);
  });

  it("advances to the next generated enemy", () => {
    const defeated = {
      ...createBattleState({ player, enemies, boss }),
      status: BATTLE_STATUS.OPPONENT_DEFEATED,
      pendingReward: 20,
    };

    const result = battleReducer(defeated, {
      type: BATTLE_REDUCER_ACTION.ADVANCE_OPPONENT,
    });

    expect(result.currentEnemyIndex).toBe(1);
    expect(result.enemy.name).toBe("Enemy Two");
    expect(result.status).toBe(BATTLE_STATUS.ACTIVE);
  });

  it("advances from the final generated enemy to the boss", () => {
    const defeated = {
      ...createBattleState({ player, enemies, boss }),
      currentEnemyIndex: 1,
      enemy: null,
      status: BATTLE_STATUS.OPPONENT_DEFEATED,
    };

    const result = battleReducer(defeated, {
      type: BATTLE_REDUCER_ACTION.ADVANCE_OPPONENT,
    });

    expect(result.currentEnemyIndex).toBe(2);
    expect(result.isBossBattle).toBe(true);
    expect(result.enemy.name).toBe("Final Boss");
  });

  it("returns the existing state for unknown actions", () => {
    const initial = createBattleState({ player, enemies, boss });
    expect(battleReducer(initial, { type: "UNKNOWN" })).toBe(initial);
  });
});
