export default function HP({ current, maximum }) {
  const safeMaximum = Math.max(1, Number(maximum) || 1);
  const safeCurrent = Math.max(0, Number(current) || 0);
  const percentage = Math.min(100, (safeCurrent / safeMaximum) * 100);

  return (
    <div className="hpContainer">
      <div className="hpBar">
        <div className="hpFill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="hpText">
        {Math.ceil(safeCurrent)} / {Math.ceil(safeMaximum)} HP
      </p>
    </div>
  );
}
