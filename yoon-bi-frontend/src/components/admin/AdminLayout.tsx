import type { PropsWithChildren } from 'react';
import { AdminLayout as BaseAdminLayout } from '../layout/AdminLayout';

type PageKey = 'dashboard' | 'users' | 'drivers' | 'trips' | 'financial' | 'reports' | 'profile' | 'settings';

interface AdminLayoutProps extends PropsWithChildren {
  currentPage: string;
  onNavigate: (p: PageKey) => void;
  onLogout?: () => void;
}

export function AdminLayout({ currentPage, onNavigate, onLogout, children }: AdminLayoutProps) {
  const allowed: PageKey[] = ['dashboard','users','drivers','trips','financial','reports','profile','settings'];
  const active: PageKey = allowed.includes(currentPage as PageKey) ? (currentPage as PageKey) : 'dashboard';
  const handleNavigate = (p: PageKey) => onNavigate(p);
  return (
    <BaseAdminLayout active={active} onNavigate={handleNavigate} onLogout={onLogout}>
      {children}
    </BaseAdminLayout>
  );
}
