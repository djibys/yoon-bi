import { useState } from 'react';
import { Login } from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/Dashboard';
import { Users } from './components/admin/Users';
import { Drivers } from './components/admin/Drivers';
import { TripsReservations } from './components/admin/TripsReservations';
import { Financial } from './components/admin/Financial';
import GestionSignalements from './components/admin/Reports';
import Profile from './components/admin/Profile';
import Settings from './components/admin/Settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'drivers':
        return <Drivers />;
      case 'trips':
        return <TripsReservations />;
      case 'financial':
        return <Financial />;
      case 'reports':
        return <GestionSignalements />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Temporairement désactivé pour le débogage
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {renderPage()}
    </AdminLayout>
  );
}
