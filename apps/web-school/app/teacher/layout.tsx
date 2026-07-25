'use client';

import { TeacherDashboardLayout } from '@cbc/ui';
import { SCHOOL_ROUTES } from '@cbc/config/routes';

const TEACHER_NAV_ITEMS = [
  { label: 'Dashboard', href: SCHOOL_ROUTES.teacherDashboard },
  { label: 'Timetable', href: '/teacher/timetable' },
  { label: 'Attendance', href: '/teacher/attendance' },
  { label: 'Assessments', href: '/teacher/assessments' },
  { label: 'Competency', href: '/teacher/competency' },
  { label: 'Department', href: '/teacher/department' },
  { label: 'Activities', href: '/teacher/activities' },
];

function TeacherSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface-dark-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-text-on-dark text-sm">Teacher Portal</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {TEACHER_NAV_ITEMS.map((item) => (
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

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherDashboardLayout sidebar={<TeacherSidebar />}>{children}</TeacherDashboardLayout>;
}
