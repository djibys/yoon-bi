import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/Dashboard';
import { Users } from './components/admin/Users';
import { Drivers } from './components/admin/Drivers';
import { TripsReservations } from './components/admin/TripsReservations';
import { Financial } from './components/admin/Financial';
import GestionSignalements from './components/admin/Reports';
import Profile from './components/admin/Profile';
import Settings from './components/admin/Settings';
import type { User } from './types/user';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Calculer currentPage depuis l'URL
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  // Fonction de déconnexion (définie en premier pour être disponible dans useEffect)
  const handleLogout = useCallback(() => {
    // Nettoyage sécurisé
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser l'état
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });
  }, [navigate]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      console.log('[AUTH] Vérification de l\'authentification...');
      
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('[AUTH] Token présent:', !!token);
        console.log('[AUTH] UserData présent:', !!userData);
        
        if (!token || !userData) {
          console.log('[AUTH] Pas de session active');
          throw new Error('Aucune session active');
        }

        // Vérifier le format du token
        if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
          console.log('[AUTH] Format de token invalide');
          throw new Error('Session invalide');
        }

        // Vérifier l'expiration du token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.log('[AUTH] Token expiré');
            throw new Error('Session expirée');
          }
        } catch (tokenError) {
          console.log('[AUTH] Erreur de décodage du token:', tokenError);
          throw new Error('Token invalide');
        }

        // Vérifier que l'utilisateur est un administrateur
        const user = JSON.parse(userData);
        console.log('[AUTH] Utilisateur chargé:', {
          id: user.id,
          email: user.email,
          typeUtilisateur: user.typeUtilisateur
        });
        
        if (user.typeUtilisateur !== 'ADMIN') {
          console.log('[AUTH] Utilisateur non autorisé - Type:', user.typeUtilisateur);
          throw new Error('Accès non autorisé');
        }

        console.log('[AUTH] ✓ Authentification réussie');
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[AUTH] ✗ Erreur:', error);
        // Nettoyage en cas d'erreur
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('[AUTH] Fin de la vérification - isLoading=false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de navigation entre les pages
  const handleNavigate = useCallback((page: string) => {
    console.log('[NAV] Navigation vers:', page);
    navigate(`/${page}`, { replace: false });
  }, [navigate]);

  const handleLogin = (user: User) => {
    console.log('[LOGIN] Traitement de la connexion pour:', user.email);
    
    // Vérifier que l'utilisateur est un administrateur
    if (user.typeUtilisateur !== 'ADMIN') {
      console.log('[LOGIN] Utilisateur non admin:', user.typeUtilisateur);
      alert('Accès réservé aux administrateurs');
      handleLogout();
      return;
    }
    
    console.log('[LOGIN] Utilisateur admin validé');
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Rediriger vers la page d'origine ou le tableau de bord
    const from = location.state?.from?.pathname || '/dashboard';
    console.log('[LOGIN] Redirection vers:', from);
    
    // Utiliser setTimeout pour s'assurer que l'état est mis à jour avant la navigation
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 0);
  };


  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Route de connexion (publique) */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } 
      />

      {/* Routes protégées avec AdminLayout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} user={currentUser}>
            <AdminLayout 
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              user={currentUser}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="trips" element={<TripsReservations />} />
        <Route path="financial" element={<Financial />} />
        <Route path="reports" element={<GestionSignalements />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirection pour les routes inconnues */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}
