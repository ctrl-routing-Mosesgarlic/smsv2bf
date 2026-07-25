import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface AdminDashboardLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function AdminDashboardLayout({ sidebar, topbar, children }: AdminDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={sidebar} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
