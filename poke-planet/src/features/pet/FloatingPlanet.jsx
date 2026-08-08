import { useContext } from "react";
import { PlayerContext } from "../../context/GameContexts";
import "./PlanetViewPage.css";

export default function FloatingPlanet() {
  const { player } = useContext(PlayerContext);

  const affinityBonus = player.affinity / 5;

  return (
    <div className="petPagePlanetContainer">
      <div className="planetContainer">
        <div className="petPagePlanet">
          <p>{player.name}</p>

          <img
            src={player.avatar}
            height="150"
            width="150"
            className="planet"
            alt={player.name}
          />
        </div>
      </div>

      <div className="petPagePlanetInfo">
        <p>{player.description}</p>
        <p>Base HP: {player.baseStats.hp + affinityBonus}</p>
        <p>Base Attack: {player.baseStats.attack + affinityBonus}</p>
        <p>Base Defense: {player.baseStats.defense + affinityBonus}</p>
        <p>Base Evasion: {player.baseStats.evasion + affinityBonus}</p>
      </div>
    </div>
  );
}
