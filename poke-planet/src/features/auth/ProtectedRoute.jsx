import { Navigate } from "react-router-dom";

import { useSession } from "../../hooks/useSession";
import { useGameActions } from "../../hooks/useGameActions";

export default function ProtectedRoute({ children }) {
  const { token } = useSession();

  const { loading, error, refresh } = useGameActions();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return <p>Loading saved game...</p>;
  }

  if (error) {
    return (
      <main>
        <h2>Unable to load your saved game</h2>

        <p>{error}</p>

        <button
          type="button"
          onClick={() => {
            void refresh().catch(() => {
              /*
               * GameDataProvider stores the error
               * for display above.
               */
            });
          }}
        >
          Retry
        </button>
      </main>
    );
  }

  return children;
}
