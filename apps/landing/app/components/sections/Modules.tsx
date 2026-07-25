import { Check } from "@phosphor-icons/react/dist/ssr";
import SectionWrapper from "../SectionWrapper";

const modules = [
  {
    title: "Academic",
    features: [
      "Academic year & term management",
      "Timetable generation",
      "Grade & stream setup",
      "Venue management",
    ],
  },
  {
    title: "Curriculum",
    features: [
      "CBC learning areas",
      "Strand & sub-strand mapping",
      "Learning outcomes per grade",
      "Curriculum browser for teachers",
    ],
  },
  {
    title: "Students",
    features: [
      "Student admission (individual & bulk)",
      "Enrollment & transfer tracking",
      "Student profiles with health records",
      "NEMIS integration",
    ],
  },
  {
    title: "Staff",
    features: [
      "Staff onboarding",
      "Learning area assignment",
      "Performance appraisals",
      "Leave management",
    ],
  },
  {
    title: "Assessment",
    features: [
      "Formative & summative assessments",
      "Competency-based rubrics",
      "Result entry & approval",
      "Report card generation",
    ],
  },
  {
    title: "Attendance",
    features: [
      "Daily class attendance",
      "Bulk attendance entry",
      "Attendance reports",
      "Hostel roll call",
    ],
  },
  {
    title: "Finance",
    features: [
      "Fee structure management",
      "M-Pesa payment integration",
      "Receipt generation",
      "Fee waivers & reports",
    ],
  },
  {
    title: "Communication",
    features: [
      "Bulk SMS via Africa's Talking",
      "School announcements",
      "Push notifications",
      "Parent messaging",
    ],
  },
  {
    title: "Library",
    features: [
      "Book catalog management",
      "Borrowing & returns",
      "Fine tracking",
      "Library usage reports",
    ],
  },
  {
    title: "Inventory",
    features: [
      "Multi-category inventory",
      "Stock in/out tracking",
      "Low-stock alerts",
      "Asset assignment",
    ],
  },
  {
    title: "Transport",
    features: [
      "Route management",
      "Vehicle tracking",
      "Driver assignment",
      "Student pickup tracking",
    ],
  },
  {
    title: "Hostel",
    features: [
      "Hostel & room management",
      "Bed allocation",
      "Hostel attendance",
      "Maintenance requests",
    ],
  },
  {
    title: "Activities",
    features: [
      "Club & activity management",
      "Coordinator assignment",
      "Participation tracking",
      "Event scheduling",
    ],
  },
  {
    title: "Compliance",
    features: [
      "Data consent management",
      "Breach incident logging",
      "Audit trails",
      "ODPC report generation",
    ],
  },
  {
    title: "Reports",
    features: [
      "Executive dashboards",
      "Governance portal",
      "NEMIS CSV/XML export",
      "Custom report builder",
    ],
  },
];

export default function Modules() {
  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold">All Modules</h2>
        <p className="mt-3 max-w-2xl text-foreground/60">
          CBC SchoolMS offers 15 integrated modules covering every aspect of
          school management. Choose the modules that match your school&apos;s
          needs.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <div key={module.title}>
            <h3 className="text-sm font-semibold">{module.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {module.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground/60">
                  <Check size={14} className="mt-0.5 shrink-0 text-foreground/30" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
