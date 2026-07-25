import { ReactNode } from 'react';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, topbar, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside className="w-64 bg-surface-dark text-white flex flex-col shrink-0">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        {topbar && (
          <header className="bg-surface border-b border-border-default px-6 py-3 sticky top-0 z-30">
            {topbar}
          </header>
        )}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
