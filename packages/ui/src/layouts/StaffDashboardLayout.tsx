import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';

interface StaffDashboardLayoutProps {
  navItems: { label: string; href: string }[];
  topbar?: ReactNode;
  children: ReactNode;
}

function StaffSidebar({ navItems }: { navItems: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-text-on-dark text-sm">Staff Portal</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-on-dark hover:bg-surface-dark-muted transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function StaffDashboardLayout({ navItems, topbar, children }: StaffDashboardLayoutProps) {
  return (
    <DashboardLayout sidebar={<StaffSidebar navItems={navItems} />} topbar={topbar}>
      {children}
    </DashboardLayout>
  );
}
