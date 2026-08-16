function formatArchetype(archetype) {
  if (!archetype) {
    return "Balanced";
  }

  return archetype.charAt(0).toUpperCase() + archetype.slice(1);
}

export default function BattleEnemyCard({ enemy, isBoss }) {
  const size = isBoss ? 200 : 100;

  return (
    <div>
      <p>{enemy.name}</p>
      <p>{formatArchetype(enemy.archetype)} opponent</p>
      {!isBoss && <p>Threat score: {enemy.threatScore}</p>}
      <img src={enemy.avatar} height={size} width={size} alt={enemy.name} />
    </div>
  );
}
