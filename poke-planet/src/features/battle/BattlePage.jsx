import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BattleUI from "./BattleUI";
import Skills from "./Skills";
import BattlePlayerCard from "./BattlePlayerCard";
import BattleEnemyCard from "./BattleEnemyCard";
import BattleLog from "./BattleLog";
import { useBattle } from "../../hooks/useBattle";
import { BATTLE_STATUS } from "../../game/battle/battleConstants";
import "./BattlePage.css";

const MESSAGE_DELAY_MS = 1400;

export default function BattlePage() {
  const navigate = useNavigate();
  const {
    battle,
    clearEvents,
    claimPendingReward,
    advanceToNextOpponent,
    resetBattle,
  } = useBattle();
  const [battleLog, setBattleLog] = useState("");

  useEffect(() => {
    if (battle.events.length === 0) {
      return undefined;
    }

    let cancelled = false;
    let timerId;
    let eventIndex = 0;
    const events = [...battle.events];
    const completedStatus = battle.status;

    function finishSequence() {
      if (cancelled) {
        return;
      }

      if (completedStatus === BATTLE_STATUS.OPPONENT_DEFEATED) {
        advanceToNextOpponent();
        return;
      }

      if (completedStatus === BATTLE_STATUS.CAMPAIGN_COMPLETE) {
        claimPendingReward();
        clearEvents();
        return;
      }

      if (completedStatus === BATTLE_STATUS.DEFEAT) {
        resetBattle();
        navigate("/main");
        return;
      }

      clearEvents();
    }

    function showNextEvent() {
      if (cancelled) {
        return;
      }

      if (eventIndex >= events.length) {
        finishSequence();
        return;
      }

      setBattleLog(events[eventIndex]);
      eventIndex += 1;
      timerId = window.setTimeout(showNextEvent, MESSAGE_DELAY_MS);
    }

    showNextEvent();

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [
    battle.actionId,
    battle.events,
    battle.status,
    advanceToNextOpponent,
    claimPendingReward,
    clearEvents,
    navigate,
    resetBattle,
  ]);

  if (battle.status === BATTLE_STATUS.IDLE || !battle.player || !battle.enemy) {
    return (
      <div className="bossBattleContainer">
        <div className="battleTitle">
          <p>No active campaign was found.</p>
          <button
            className="battleSkillsButton"
            onClick={() => navigate("/campaign")}
          >
            Generate Campaign
          </button>
        </div>
      </div>
    );
  }

  if (
    battle.status === BATTLE_STATUS.CAMPAIGN_COMPLETE &&
    battle.events.length === 0
  ) {
    return (
      <div className="bossBattleContainer">
        <div className="battleTitle">
          <p>Campaign complete!</p>
          <p>Your reward:</p>
          <p>100 Energy</p>
          <button
            className="battleSkillsButton"
            onClick={() => {
              resetBattle();
              navigate("/main");
            }}
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        battle.isBossBattle ? "bossBattleContainer" : "battleContainer"
      }
    >
      <div className="battleTitle">
        <h2>
          {battle.isBossBattle
            ? "Final Boss"
            : `Enemy ${battle.currentEnemyIndex + 1}`}
        </h2>
      </div>

      <div className="battlePlayer">
        <BattlePlayerCard player={battle.player} />
      </div>

      <div className="battleEnemy">
        <BattleEnemyCard enemy={battle.enemy} isBoss={battle.isBossBattle} />
      </div>

      <div className="battleUI">
        <BattleUI player={battle.player} enemy={battle.enemy} />
      </div>

      <div className="battleStatus">
        <BattleLog log={battleLog} />
      </div>

      <div className="battleSkills">
        <Skills battleLocked={battle.events.length > 0} />
      </div>
    </div>
  );
}
