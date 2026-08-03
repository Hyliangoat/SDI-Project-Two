import { Navigate } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useGameActions } from '../../hooks/useGameActions';
export default function ProtectedRoute({ children, requirePlayer = false }) {
  const { token } = useSession();
  const { loading } = useGameActions();
  if (!token) return <Navigate to="/auth" replace />;
  if (loading) return <p>Loading saved game...</p>;
  return children;
}