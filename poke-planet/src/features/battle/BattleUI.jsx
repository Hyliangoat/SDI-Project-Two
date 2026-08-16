import HP from "./HP";
import "./BattlePage.css";

export default function BattleUI({ player, enemy }) {
  return (
    <div className="healthBars">
      <div className="playerHealth">
        <p>Player health:</p>
        <HP current={player.health} maximum={player.maxHealth} />
      </div>

      <div className="enemyHealth">
        <p>Enemy health:</p>
        <HP current={enemy.health} maximum={enemy.maxHealth} />
      </div>
    </div>
  );
}
