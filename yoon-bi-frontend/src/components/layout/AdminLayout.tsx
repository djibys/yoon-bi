import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { House, Users, Car, Ticket, Wallet, AlertTriangle, User, Settings } from 'lucide-react';
import { Logo } from '../Logo';
import type { User as UserType } from '../../types/user';

type PageKey = 'dashboard' | 'users' | 'drivers' | 'trips' | 'financial' | 'reports' | 'profile' | 'settings';

interface AdminLayoutProps {
  onLogout?: () => void;
  onNavigate?: (page: PageKey) => void;
  active?: PageKey;
  user: UserType | null;
}

export function AdminLayout({ onLogout, onNavigate, active, user }: AdminLayoutProps) {
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      if (onLogout) onLogout();
    }
  };

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const handleSettingsClick = () => {
    if (onNavigate) {
      onNavigate('settings');
    }
  };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <Logo 
              size={110}
              style={{
                borderRadius: '8px'
              }}
            />
          </div>
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
      </aside>

      <div className="main-content">
        <Navbar expand="lg" className="navbar">
          <Container fluid className="px-4">
            <Navbar.Text className="text-muted me-auto">Lundi 20 Octobre 2025</Navbar.Text>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <div className="notif-dot" />
                <Dropdown align="end" className="dropdown-no-arrow ms-3">
                  <Dropdown.Toggle as="div" className="p-0 bg-transparent border-0" style={{ backgroundImage: 'none', cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-2 cursor-pointer">
                      {user?.photo ? (
                        <img 
                          src={user.photo} 
                          alt="Profile" 
                          className="avatar-circle" 
                          style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <div className="avatar-circle bg-success d-flex align-items-center justify-content-center text-white fw-bold" style={{ fontSize: '12px', width: '36px', height: '36px' }}>
                          {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                        </div>
                      )}
                      <div className="d-none d-sm-block">
                        <div className="fw-semibold small">{user?.prenom} {user?.nom}</div>
                        <div className="text-muted small">{user?.email}</div>
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item onClick={handleProfileClick} className="d-flex align-items-center gap-2">
                      <User size={16} />
                      Mon profil
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleSettingsClick} className="d-flex align-items-center gap-2">
                      <Settings size={16} />
                      Paramètres
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Déconnexion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
