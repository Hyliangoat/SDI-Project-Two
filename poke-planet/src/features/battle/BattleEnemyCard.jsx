export default function BattleEnemyCard({ enemy, isBoss }) {
  const size = isBoss ? 200 : 100;

  return (
    <div>
      <p>{enemy.name}</p>
      <img
        src={enemy.avatar}
        height={size}
        width={size}
        alt={enemy.name}
      />
    </div>
  );
}