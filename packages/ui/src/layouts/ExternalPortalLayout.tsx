import { ReactNode } from 'react';

interface ExternalPortalLayoutProps {
  navItems: { label: string; href: string }[];
  schoolName?: string;
  schoolLogo?: string;
  expiresAt?: string;
  children: ReactNode;
}

export function ExternalPortalLayout({
  navItems,
  schoolName = 'School',
  schoolLogo,
  expiresAt,
  children,
}: ExternalPortalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <header className="bg-surface border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {schoolLogo ? (
                <img src={schoolLogo} alt={schoolName} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-on-primary font-bold">{schoolName.charAt(0)}</span>
                </div>
              )}
              <span className="font-semibold text-text-primary">{schoolName}</span>
            </div>
          </div>
        </div>
      </header>

      {expiresAt && (
        <div className="bg-warning-light border-b border-warning-border px-4 py-2.5 text-center">
          <p className="text-sm text-warning font-medium">
            You are logged in as an external guest. Your access expires on {expiresAt}.
          </p>
        </div>
      )}

      <div className="flex flex-1">
        <aside className="w-56 bg-surface-dark text-white flex flex-col shrink-0">
          <nav className="flex-1 p-3 space-y-1 mt-4">
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
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
