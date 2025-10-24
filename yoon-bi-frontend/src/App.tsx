import { useState } from 'react';
import { Login } from './components/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { Users } from './components/admin/Users';
import { Drivers } from './components/admin/Drivers';
import { TripsReservations } from './components/admin/TripsReservations';
import { Financial } from './components/admin/Financial';
import { Reports } from './components/admin/Reports';
import { Profile } from './components/admin/Profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
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
        return <Reports />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}
