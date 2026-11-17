import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks logged-out users, and users whose role is not allowed
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/directory" replace />;
  return children;
}
