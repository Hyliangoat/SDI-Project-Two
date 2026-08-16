import { useCallback, useMemo, useReducer } from "react";
import { BattleContext } from "./BattleContext";
import { battleReducer } from "../game/battle/battleReducer";
import { createIdleBattleState } from "../game/battle/createBattleState";
import {
  BATTLE_REDUCER_ACTION,
  RANDOM_VALUES_PER_TURN,
} from "../game/battle/battleConstants";
import { useGameActions } from "../hooks/useGameActions";

function createRandomValues() {
  return Array.from({ length: RANDOM_VALUES_PER_TURN }, () => Math.random());
}

export function BattleProvider({ children }) {
  const [battle, dispatch] = useReducer(
    battleReducer,
    undefined,
    createIdleBattleState,
  );
  const { awardEnergy } = useGameActions();

  const startCampaign = useCallback(({ player, enemies, boss }) => {
    dispatch({
      type: BATTLE_REDUCER_ACTION.START_CAMPAIGN,
      payload: { player, enemies, boss },
    });
  }, []);

  const performAction = useCallback((actionName) => {
    dispatch({
      type: BATTLE_REDUCER_ACTION.PLAYER_ACTION,
      payload: {
        actionName,
        randomValues: createRandomValues(),
      },
    });
  }, []);

  const clearEvents = useCallback(() => {
    dispatch({ type: BATTLE_REDUCER_ACTION.CLEAR_EVENTS });
  }, []);

  const claimPendingReward = useCallback(() => {
    if (battle.pendingReward <= 0) {
      return;
    }

    const reward = battle.pendingReward;
    void awardEnergy(reward, battle.isBossBattle)
      .then(() => {
        dispatch({ type: BATTLE_REDUCER_ACTION.CLAIM_REWARD });
      })
      .catch((error) => console.error("Unable to save reward:", error));
  }, [battle.pendingReward, battle.isBossBattle, awardEnergy]);

  const advanceToNextOpponent = useCallback(() => {
    if (battle.pendingReward > 0) {
      const reward = battle.pendingReward;
      void awardEnergy(reward, false).catch((error) =>
        console.error("Unable to save reward:", error),
      );
    }

    dispatch({ type: BATTLE_REDUCER_ACTION.ADVANCE_OPPONENT });
  }, [battle.pendingReward, awardEnergy]);

  const resetBattle = useCallback(() => {
    dispatch({ type: BATTLE_REDUCER_ACTION.RESET_BATTLE });
  }, []);

  const value = useMemo(
    () => ({
      battle,
      startCampaign,
      performAction,
      clearEvents,
      claimPendingReward,
      advanceToNextOpponent,
      resetBattle,
    }),
    [
      battle,
      startCampaign,
      performAction,
      clearEvents,
      claimPendingReward,
      advanceToNextOpponent,
      resetBattle,
    ],
  );

  return (
    <BattleContext.Provider value={value}>{children}</BattleContext.Provider>
  );
}
