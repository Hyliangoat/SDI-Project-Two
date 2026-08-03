import { useContext } from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { PlayerContext } from '../context/GameContexts';

import StarterSelectPage from '../features/starter/StarterSelectPage';
import MainMenu from '../features/MainMenu';
import ShopPage from '../features/shop/ShopPage';
import PlanetViewPage from '../features/pet/PlanetViewPage';
import CampaignPage from '../features/campaign/CampaignPage';
import BattlePage from '../features/battle/BattlePage';
import AuthPage from '../features/auth/AuthPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';

function HomeRoute() {
  const { player } = useContext(PlayerContext);

  if (player) {
    return (
      <Navigate
        to="/main"
        replace
      />
    );
  }

  return <StarterSelectPage />;
}

function PlayerRequired({
  children,
}) {
  const { player } = useContext(PlayerContext);

  if (!player) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <HomeRoute />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/main"
          element={(
            <ProtectedRoute>
              <PlayerRequired>
                <MainMenu />
              </PlayerRequired>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/shop"
          element={(
            <ProtectedRoute>
              <PlayerRequired>
                <ShopPage />
              </PlayerRequired>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/campaign"
          element={(
            <ProtectedRoute>
              <PlayerRequired>
                <CampaignPage />
              </PlayerRequired>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/planet-care"
          element={(
            <ProtectedRoute>
              <PlayerRequired>
                <PlanetViewPage />
              </PlayerRequired>
            </ProtectedRoute>
          )}
        />

        <Route
          path="/battle"
          element={(
            <ProtectedRoute>
              <PlayerRequired>
                <BattlePage />
              </PlayerRequired>
            </ProtectedRoute>
          )}
        />

        <Route
          path="*"
          element={(
            <Navigate
              to="/"
              replace
            />
          )}
        />
      </Routes>
    </Router>
  );
}