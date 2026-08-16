import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CampEnemyCard from "./CampEnemyCards";
import CampBossCard from "./CampBossCard";
import { PlayerContext } from "../../context/GameContexts";
import { createCampaign } from "../../game/campaign/createCampaign";
import { useBattle } from "../../hooks/useBattle";
import "./CampaignPage.css";

/*
This component represents the campaign page of the game. It fetches a campaign with a specified number of enemies and a boss, and displays them on the page. 
The player can start the campaign by clicking the "Begin Campaign" button, which navigates to the battle page. If there is an error while fetching the campaign, 
an error message is displayed along with a "Retry" button to attempt fetching the campaign again.
*/
const ENEMY_SLOT_CLASSES = [
  "campaign-one",
  "campaign-two",
  "campaign-three",
  "campaign-four",
];

export default function CampaignPage() {
  const navigate = useNavigate();
  const { player } = useContext(PlayerContext);
  const { startCampaign } = useBattle();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCampaign() {
      setCampaign(null);
      setError("");

      try {
        const generatedCampaign = await createCampaign(4);
        if (!cancelled) {
          setCampaign(generatedCampaign);
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setError("The campaign could not be generated. Please try again.");
        }
      }
    }

    loadCampaign();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const beginCampaign = () => {
    if (!player || !campaign) {
      return;
    }

    startCampaign({
      player,
      enemies: campaign.enemies,
      boss: campaign.boss,
    });
    navigate("/battle");
  };

  return (
    <div className="campaign-container">
      <h1 className="campaign-title">Campaign</h1>

      <div className="campaign-boss">
        <div className="campaign-card">
          <h2>System Overlord</h2>
          <CampBossCard boss={campaign?.boss} />
        </div>
      </div>

      <h2 className="campaign-minions">The underlings</h2>

      {ENEMY_SLOT_CLASSES.map((className, index) => (
        <div className={className} key={className}>
          <div className="campaign-card">
            <CampEnemyCard enemy={campaign?.enemies[index]} />
          </div>
        </div>
      ))}

      <div className="campaign-button">
        {error ? (
          <>
            <p>{error}</p>
            <button
              className="campaign-button"
              onClick={() => setRequestId((current) => current + 1)}
            >
              Retry
            </button>
          </>
        ) : campaign ? (
          <button className="campaign-button" onClick={beginCampaign}>
            Begin Campaign
          </button>
        ) : (
          <p>Loading your challengers...</p>
        )}
      </div>
    </div>
  );
}
