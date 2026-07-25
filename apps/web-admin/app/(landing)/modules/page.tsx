import Link from 'next/link';
import { AUTH_ROUTES } from '@cbc/config/routes';

const MODULES = [
  {
    name: 'Academic',
    description:
      'Manage academic years, terms, grade levels, streams, and timetables. Supports multi-track calendars.',
    features: ['Academic year & term management', 'Timetable generation', 'Grade & stream setup', 'Venue management'],
  },
  {
    name: 'Curriculum',
    description:
      'CBC-aligned learning areas, strands, sub-strands, and learning outcomes. Configurable per grade.',
    features: ['CBC learning areas', 'Strand & sub-strand mapping', 'Learning outcomes per grade', 'Curriculum browser for teachers'],
  },
  {
    name: 'Students',
    description:
      'End-to-end student management from admission to graduation. Bulk admit, transfer, and promote.',
    features: ['Student admission (individual & bulk)', 'Enrollment & transfer tracking', 'Student profiles with health records', 'NEMIS integration'],
  },
  {
    name: 'Staff',
    description:
      'Staff onboarding, role assignment, learning area allocation, and appraisal management.',
    features: ['Staff onboarding', 'Learning area assignment', 'Performance appraisals', 'Leave management'],
  },
  {
    name: 'Assessment',
    description:
      'CBC formative and summative assessments with competency tracking. Customizable rubrics and report cards.',
    features: ['Formative & summative assessments', 'Competency-based rubrics', 'Result entry & approval', 'Report card generation'],
  },
  {
    name: 'Attendance',
    description:
      'Daily attendance marking, bulk entry, and attendance analytics. Supports class and hostel attendance.',
    features: ['Daily class attendance', 'Bulk attendance entry', 'Attendance reports', 'Hostel roll call'],
  },
  {
    name: 'Finance',
    description:
      'Complete financial management: fee structures, M-Pesa integration, receipts, waivers, and reports.',
    features: ['Fee structure management', 'M-Pesa payment integration', 'Receipt generation', 'Fee waivers & reports'],
  },
  {
    name: 'Communication',
    description:
      'Bulk SMS (Africa&apos;s Talking), announcements, push notifications, and parent-teacher communication.',
    features: ['Bulk SMS via Africa\'s Talking', 'School announcements', 'Push notifications', 'Parent messaging'],
  },
  {
    name: 'Library',
    description:
      'Book catalog, borrowing management, fines, and library analytics.',
    features: ['Book catalog management', 'Borrowing & returns', 'Fine tracking', 'Library usage reports'],
  },
  {
    name: 'Inventory',
    description:
      'Track laboratory equipment, ICT assets, kitchen supplies, and general stock across categories.',
    features: ['Multi-category inventory', 'Stock in/out tracking', 'Low-stock alerts', 'Asset assignment'],
  },
  {
    name: 'Transport',
    description:
      'Route management, vehicle tracking, driver assignments, and student pickup/drop-off tracking.',
    features: ['Route management', 'Vehicle tracking', 'Driver assignment', 'Student pickup tracking'],
  },
  {
    name: 'Hostel',
    description:
      'Boarding management with bed allocations, hostel attendance, and maintenance tracking.',
    features: ['Hostel & room management', 'Bed allocation', 'Hostel attendance', 'Maintenance requests'],
  },
  {
    name: 'Activities',
    description:
      'Co-curricular activity and club management with coordinator assignments and participation tracking.',
    features: ['Club & activity management', 'Coordinator assignment', 'Participation tracking', 'Event scheduling'],
  },
  {
    name: 'Compliance',
    description:
      'Data protection (ODPC), consent management, breach logging, and audit trails for regulatory compliance.',
    features: ['Data consent management', 'Breach incident logging', 'Audit trails', 'ODPC report generation'],
  },
  {
    name: 'Reports',
    description:
      'Executive dashboards, governance portals, NEMIS exports, and custom report generation.',
    features: ['Executive dashboards', 'Governance portal', 'NEMIS CSV/XML export', 'Custom report builder'],
  },
];

export default function ModulesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          All Modules
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CBC SchoolMS offers 15 integrated modules covering every aspect of school management.
          Choose the modules that match your school&apos;s needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod) => (
          <div
            key={mod.name}
            className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {mod.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {mod.description}
            </p>
            <ul className="space-y-1">
              {mod.features.map((f) => (
                <li key={f} className="text-sm text-gray-500 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href={AUTH_ROUTES.register}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Start with the Modules You Need
        </Link>
      </div>
    </div>
  );
}
