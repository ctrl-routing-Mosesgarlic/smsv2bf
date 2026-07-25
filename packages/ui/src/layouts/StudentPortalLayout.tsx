import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface StudentPortalLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function StudentPortalLayout({ sidebar, topbar, children }: StudentPortalLayoutProps) {
  return (
    <DashboardLayout sidebar={sidebar} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
