import { useState } from "react";
import { useGameActions } from "../../hooks/useGameActions";
import "./ShopPage.css";
export default function ShopItem({ item }) {
  const { purchaseItem } = useGameActions();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function buy() {
    setBusy(true);
    setError("");
    try {
      await purchaseItem(item.code);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="shopItem" onClick={busy ? undefined : buy}>
      <img src={item.image} height="100" width="100" alt={item.name} />
      <p>{item.name}</p>
      <p>{item.description}</p>
      <p>Price: {item.energy_cost} energy</p>
      {error && <p>{error}</p>}
      {busy && <p>Purchasing...</p>}
    </div>
  );
}
