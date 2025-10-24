import type { PropsWithChildren } from 'react';
import { AdminLayout as BaseAdminLayout } from '../layout/AdminLayout';

type PageKey = 'dashboard' | 'users' | 'drivers' | 'trips' | 'financial' | 'reports' | 'profile';

export function AdminLayout({ currentPage, onNavigate, children }: PropsWithChildren & { currentPage: string; onNavigate: (p: PageKey) => void }) {
  const allowed: PageKey[] = ['dashboard','users','drivers','trips','financial','reports','profile'];
  const active: PageKey = allowed.includes(currentPage as PageKey) ? (currentPage as PageKey) : 'dashboard';
  const handleNavigate = (p: PageKey) => onNavigate(p);
  return (
    <BaseAdminLayout active={active} onNavigate={handleNavigate}>
      {children}
    </BaseAdminLayout>
  );
}
