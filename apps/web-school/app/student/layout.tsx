'use client';

import { StudentPortalLayout } from '@cbc/ui';
import { SCHOOL_ROUTES } from '@cbc/config/routes';

const STUDENT_NAV_ITEMS = [
  { label: 'Dashboard', href: SCHOOL_ROUTES.studentDashboard },
  { label: 'Results', href: '/student/results' },
  { label: 'Attendance', href: '/student/attendance' },
  { label: 'Fees', href: '/student/fees' },
  { label: 'Timetable', href: '/student/timetable' },
  { label: 'Library', href: '/student/library' },
];

function StudentSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-text-on-dark text-sm">Student Portal</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {STUDENT_NAV_ITEMS.map((item) => (
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

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentPortalLayout sidebar={<StudentSidebar />}>{children}</StudentPortalLayout>;
}
