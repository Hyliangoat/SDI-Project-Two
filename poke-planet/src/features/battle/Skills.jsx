import {
  BATTLE_ACTION,
  BATTLE_STATUS,
} from "../../game/battle/battleConstants";
import { useBattle } from "../../hooks/useBattle";
import "./BattlePage.css";

export default function Skills({ battleLocked }) {
  const { battle, performAction } = useBattle();
  const disabled = battleLocked || battle.status !== BATTLE_STATUS.ACTIVE;

  return (
    <div className="skillsButtons">
      <button
        disabled={disabled}
        className="battleSkillsButton"
        onClick={() => performAction(BATTLE_ACTION.ATTACK)}
      >
        Attack
      </button>
      <button
        disabled={disabled}
        className="battleSkillsButton"
        onClick={() => performAction(BATTLE_ACTION.EVADE)}
      >
        Evade
      </button>
      <button
        disabled={disabled}
        className="battleSkillsButton"
        onClick={() => performAction(BATTLE_ACTION.SPECIAL)}
      >
        Special ({battle.player?.specialCooldown ?? 0})
      </button>
      <button
        disabled={disabled}
        className="battleSkillsButton"
        onClick={() => performAction(BATTLE_ACTION.HEAL)}
      >
        Heal ({battle.player?.healsRemaining ?? 0})
      </button>
    </div>
  );
}
