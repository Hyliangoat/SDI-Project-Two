import {
  BATTLE_REDUCER_ACTION,
} from './battleConstants';
import {
  createBattleState,
  createIdleBattleState,
} from './createBattleState';
import { advanceOpponent, resolveTurn } from './battleActions';

export function battleReducer(state, action) {
  switch (action.type) {
    case BATTLE_REDUCER_ACTION.START_CAMPAIGN:
      return createBattleState(action.payload);

    case BATTLE_REDUCER_ACTION.PLAYER_ACTION:
      return resolveTurn(
        state,
        action.payload.actionName,
        action.payload.randomValues,
      );

    case BATTLE_REDUCER_ACTION.ADVANCE_OPPONENT:
      return advanceOpponent(state);

    case BATTLE_REDUCER_ACTION.CLEAR_EVENTS:
      return { ...state, events: [] };

    case BATTLE_REDUCER_ACTION.CLAIM_REWARD:
      return { ...state, pendingReward: 0 };

    case BATTLE_REDUCER_ACTION.RESET_BATTLE:
      return createIdleBattleState();

    default:
      return state;
  }
}