import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface FinanceDashboardLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function FinanceDashboardLayout({ sidebar, topbar, children }: FinanceDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={sidebar} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
