import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '../types/user';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  user: User | null;
  children: React.ReactNode;
}

export function ProtectedRoute({ isAuthenticated, user, children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    console.log('[PROTECTED] Non authentifié, redirection vers /login');
    // Sauvegarder la page demandée pour y revenir après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.typeUtilisateur !== 'ADMIN') {
    console.log('[PROTECTED] Utilisateur non admin, redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
