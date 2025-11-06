import { AdminLayout as BaseAdminLayout } from '../layout/AdminLayout';
import type { User } from '../../types/user';

type PageKey = 'dashboard' | 'users' | 'drivers' | 'drivers-validation' | 'trips' | 'financial' | 'reports' | 'profile' | 'settings';

interface AdminLayoutProps {
  currentPage: string;
  onNavigate: (p: PageKey) => void;
  onLogout?: () => void;
  user: User | null;
}

export function AdminLayout({ currentPage, onNavigate, onLogout, user }: AdminLayoutProps) {
  const allowed: PageKey[] = ['dashboard','users','drivers','drivers-validation','trips','financial','reports','profile','settings'];
  const active: PageKey = allowed.includes(currentPage as PageKey) ? (currentPage as PageKey) : 'dashboard';
  const handleNavigate = (p: PageKey) => onNavigate(p);
  return (
    <BaseAdminLayout active={active} onNavigate={handleNavigate} onLogout={onLogout} user={user} />
  );
}
