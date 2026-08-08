export default function BattlePlayerCard({ player }) {
  return (
    <div>
      <p>{player.name}</p>
      <img src={player.avatar} width="100" height="100" alt={player.name} />
    </div>
  );
}
