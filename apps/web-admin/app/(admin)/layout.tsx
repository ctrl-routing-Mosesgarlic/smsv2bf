'use client';

import { DashboardLayout } from '@cbc/ui';
import { PLATFORM_ROUTES } from '@cbc/config/routes';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: PLATFORM_ROUTES.dashboard },
  { label: 'Tenants', href: PLATFORM_ROUTES.tenants },
  { label: 'Subscription Plans', href: PLATFORM_ROUTES.subscriptionPlans },
  { label: 'Plan Features', href: PLATFORM_ROUTES.planFeatures },
  { label: 'Access Policies', href: PLATFORM_ROUTES.accessPolicies },
  { label: 'Audit Logs', href: PLATFORM_ROUTES.auditLogs },
  { label: 'Schools', href: PLATFORM_ROUTES.schools },
  { label: 'School Groups', href: PLATFORM_ROUTES.schoolGroups },
  { label: 'Users', href: PLATFORM_ROUTES.users },
  { label: 'Roles', href: PLATFORM_ROUTES.roles },
  { label: 'Subscription', href: PLATFORM_ROUTES.subscription },
  { label: 'Billing', href: PLATFORM_ROUTES.billing },
  { label: 'Compliance', href: PLATFORM_ROUTES.compliance },
];

function AdminSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <h2 className="font-semibold text-text-on-dark text-sm">Admin Panel</h2>
        <p className="text-xs text-text-muted mt-0.5">Platform Management</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-on-dark hover:bg-surface-dark-muted transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="p-3 border-t border-surface-dark-muted">
        <p className="text-xs text-text-muted">CBC SchoolMS v2.0</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout sidebar={<AdminSidebar />}>{children}</DashboardLayout>;
}
