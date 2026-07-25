import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface ParentPortalLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function ParentPortalLayout({ sidebar, topbar, children }: ParentPortalLayoutProps) {
  return (
    <DashboardLayout sidebar={sidebar} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
