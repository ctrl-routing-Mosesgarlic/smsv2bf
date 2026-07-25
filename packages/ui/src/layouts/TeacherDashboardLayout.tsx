import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface TeacherDashboardLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function TeacherDashboardLayout({ sidebar, topbar, children }: TeacherDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={sidebar} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
