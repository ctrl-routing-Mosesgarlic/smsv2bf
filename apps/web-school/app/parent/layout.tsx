'use client';

import { ParentPortalLayout } from '@cbc/ui';
import { SCHOOL_ROUTES } from '@cbc/config/routes';

const PARENT_NAV_ITEMS = [
  { label: 'Dashboard', href: SCHOOL_ROUTES.parentDashboard },
  { label: 'Children', href: '/parent/children' },
  { label: 'Fees', href: '/parent/fees' },
  { label: 'Communication', href: '/parent/communication' },
];

function ParentSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-text-on-dark text-sm">Parent Portal</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {PARENT_NAV_ITEMS.map((item) => (
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

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <ParentPortalLayout sidebar={<ParentSidebar />}>{children}</ParentPortalLayout>;
}
