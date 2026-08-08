function formatArchetype(archetype) {
  if (!archetype) {
    return "Unknown";
  }
  return archetype.charAt(0).toUpperCase() + archetype.slice(1);
}

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
      <p>Archetype: {formatArchetype(enemy.enemyArchetype)}</p>
      <p>Threat score: {enemy.threatScore}</p>
      <p>HP: {enemy.enemyHp}</p>
      <p>Attack: {enemy.enemyAttack}</p>
      <p>Defense: {enemy.enemyDefense}</p>
      <p>Evasion: {enemy.enemyEvasion}</p>
    </div>
  );
}
