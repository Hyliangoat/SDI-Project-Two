export default function CampEnemyCard({ enemy }) {
  if (!enemy) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Enemy name: {enemy.enemyName}</p>
      <img
        src={enemy.enemyAvatar}
        height="100"
        width="100"
        alt={enemy.enemyName}
      />
      <p>HP: {enemy.enemyHp}</p>
      <p>Attack: {enemy.enemyAttack}</p>
      <p>Defense: {enemy.enemyDefense}</p>
      <p>Evasion: {enemy.enemyEvasion}</p>
    </div>
  );
}