export default function CampBossCard({ boss }) {
  if (!boss) {
    return <p>Loading boss...</p>;
  }

  return (
    <div>
      <p>{boss.name}</p>
      <img src={boss.bossAvatar} width="200" height="200" alt={boss.name} />
    </div>
  );
}
