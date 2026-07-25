'use client';

import { AdminDashboardLayout } from '@cbc/ui';
import { SCHOOL_ROUTES } from '@cbc/config/routes';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: SCHOOL_ROUTES.adminDashboard },
  { label: 'Students', href: '/admin/students' },
  { label: 'Admissions', href: '/admin/students/admit' },
  { label: 'Staff', href: '/admin/staff' },
  { label: 'Academic', href: '/admin/academic' },
  { label: 'Timetable', href: '/admin/academic/timetable' },
  { label: 'Curriculum', href: '/admin/curriculum' },
  { label: 'Transport', href: '/admin/transport' },
  { label: 'Hostel', href: '/admin/hostel' },
  { label: 'Library', href: '/admin/library' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Activities', href: '/admin/activities' },
  { label: 'Communication', href: '/admin/communication' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Compliance', href: '/admin/compliance' },
];

function AdminSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-text-on-dark text-sm">School Admin</span>
        </div>
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
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout sidebar={<AdminSidebar />}>{children}</AdminDashboardLayout>;
}
