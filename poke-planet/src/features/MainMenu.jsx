import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { PlayerContext } from "../context/GameContexts";
import { useSession } from "../hooks/useSession";

import "./MainMenu.css";

export default function MainMenu() {
  const { player } = useContext(PlayerContext);

  const { logout } = useSession();

  const navigate = useNavigate();

  function handleClick(choice) {
    navigate(`/${choice}`);
  }

  function handleLogout() {
    logout();

    navigate("/auth", {
      replace: true,
    });
  }

  return (
    <div className="main-menu">
      <h1 className="menu-title">Poké Planets</h1>

      <p className="player-info">
        Your planet is: <span>{player.name}</span>
      </p>

      <button type="button" className="sign-out-button" onClick={handleLogout}>
        Sign out
      </button>

      <div className="menu-grid">
        <div
          className="menu-card"
          onClick={() => {
            handleClick("campaign");
          }}
        >
          <h1>Campaign</h1>
          <p>Challenge another system</p>
        </div>

        <div
          className="menu-card"
          onClick={() => {
            handleClick("shop");
          }}
        >
          <h1>Shop</h1>
          <p>Equip your planet</p>
        </div>

        <div
          className="menu-card"
          onClick={() => {
            handleClick("planet-care");
          }}
        >
          <h1>Planet Care</h1>
          <p>Customize and care for your planet</p>
        </div>
      </div>
    </div>
  );
}
