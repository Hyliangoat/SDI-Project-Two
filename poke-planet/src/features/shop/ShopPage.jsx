import { useContext } from "react";
import {
  EnergyContext,
  InventoryContext,
  ShopContext,
} from "../../context/GameContexts";
import { useNavigate } from "react-router-dom";
import ShopItem from "./ShopItem";
import "./ShopPage.css";

export default function ShopPage() {
  const { energy } = useContext(EnergyContext);
  const { shop } = useContext(ShopContext);
  const { inventory } = useContext(InventoryContext);
  const navigate = useNavigate();
  const ownedCodes = new Set(inventory.map((item) => item.code));
  return (
    <div>
      <button className="shopButton" onClick={() => navigate("/main")}>
        Return To Menu
      </button>
      <h1 className="shopTitle">Welcome to the Planet Shop</h1>
      <p className="shopCurrency">You have {energy.amount} energy!</p>
      <div className="shopItemsGrid">
        {shop
          .filter((item) => !ownedCodes.has(item.code))
          .map((item) => (
            <ShopItem key={item.code} item={item} />
          ))}
      </div>
    </div>
  );
}
