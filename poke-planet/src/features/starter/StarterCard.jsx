import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { fetchPlanetCard } from '../../game/models/PlayerPlanet';
import { useGameActions } from '../../hooks/useGameActions';

import './StarterSelectPage.css';

export default function StarterCard({
  name,
}) {
  const [card, setCard] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const {
    selectStarter,
  } = useGameActions();

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const planetCard = await fetchPlanetCard(
          name,
        );

        if (!cancelled) {
          setCard(planetCard);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load this starter.',
          );
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [name]);

  async function handleClick() {
    if (!card || busy) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      /*
       * The already-loaded card contains the stable
       * starter ID and NASA avatar URL. A second NASA
       * request is unnecessary.
       */
      await selectStarter(
        card.id,
        card.avatar,
      );

      navigate(
        '/main',
        {
          replace: true,
        },
      );
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : 'Unable to select the starter.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (error && !card) {
    return (
      <div className="planet-card">
        <p>{error}</p>
      </div>
    );
  }

  if (!card) {
    return <p>Loading...</p>;
  }

  return (
    <button
      type="button"
      className="planet-card"
      onClick={handleClick}
      disabled={busy}
    >
      <div className="planet-preview">
        <img
          src={card.avatar}
          alt={card.name}
        />

        <p>{card.name}</p>
      </div>

      <div className="planet-info">
        <p>{card.description}</p>
        <p>
          Base HP:
          {' '}
          {card.baseStats.hp}
        </p>
        <p>
          Base Attack:
          {' '}
          {card.baseStats.attack}
        </p>
        <p>
          Base Defense:
          {' '}
          {card.baseStats.defense}
        </p>
        <p>
          Base Evasion:
          {' '}
          {card.baseStats.evasion}
        </p>

        {busy && <p>Saving starter...</p>}
        {error && <p>{error}</p>}
      </div>
    </button>
  );
}