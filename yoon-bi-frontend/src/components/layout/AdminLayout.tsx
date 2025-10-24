import type { PropsWithChildren } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { House, Users, Car, Ticket, Wallet, AlertTriangle } from 'lucide-react';

type PageKey = 'dashboard' | 'users' | 'drivers' | 'trips' | 'financial' | 'reports' | 'profile';

export function AdminLayout({ children, onLogout, onNavigate, active }: PropsWithChildren & { onLogout?: () => void; onNavigate?: (page: PageKey) => void; active?: PageKey }) {
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      if (onLogout) onLogout();
    }
  };
  return (
    <div className="admin-layout d-flex">
      <aside className="admin-sidebar p-3 d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <div className="brand-logo rounded-3" />
          <div className="fw-semibold">Yoon-Bi<br /><span className="text-muted small">Admin Dashboard</span></div>
        </div>
        <Nav className="flex-column gap-1">
          <Nav.Link active={active === 'dashboard'} onClick={() => onNavigate?.('dashboard')} className="sidebar-link d-flex align-items-center gap-2">
            <House size={18} />
            <span>Tableau de bord</span>
          </Nav.Link>
          <Nav.Link active={active === 'users'} onClick={() => onNavigate?.('users')} className="sidebar-link d-flex align-items-center gap-2">
            <Users size={18} />
            <span>Utilisateurs</span>
          </Nav.Link>
          <Nav.Link active={active === 'drivers'} onClick={() => onNavigate?.('drivers')} className="sidebar-link d-flex align-items-center gap-2">
            <Car size={18} />
            <span>Chauffeurs</span>
          </Nav.Link>
          <Nav.Link active={active === 'trips'} onClick={() => onNavigate?.('trips')} className="sidebar-link d-flex align-items-center gap-2">
            <Ticket size={18} />
            <span>Trajets & Réservations</span>
          </Nav.Link>
          <Nav.Link active={active === 'financial'} onClick={() => onNavigate?.('financial')} className="sidebar-link d-flex align-items-center gap-2">
            <Wallet size={18} />
            <span>Gestion financière</span>
          </Nav.Link>
          <Nav.Link active={active === 'reports'} onClick={() => onNavigate?.('reports')} className="sidebar-link d-flex align-items-center gap-2 position-relative">
            <AlertTriangle size={18} />
            <span>Signalements</span>
            <span className="badge rounded-pill bg-danger ms-auto">5</span>
          </Nav.Link>
        </Nav>
        <div className="mt-auto pt-3">
          <Button variant="danger" className="w-100" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="admin-main flex-grow-1">
        <Navbar bg="white" className="admin-topbar border-bottom px-3" expand="sm">
          <Container fluid className="px-0">
            <Navbar.Text className="text-muted">Lundi 20 Octobre 2025</Navbar.Text>
            <div className="ms-auto d-flex align-items-center gap-3">
              <div className="notif-dot" />
              <div className="d-flex align-items-center gap-2">
                <div className="avatar-circle bg-success text-white">AD</div>
                <div className="d-none d-sm-block">
                  <div className="fw-semibold small">Admin Principal</div>
                  <div className="text-muted small">admin@yoon-bi.sn</div>
                </div>
              </div>
            </div>
          </Container>
        </Navbar>
        <main className="admin-content p-3 p-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}
