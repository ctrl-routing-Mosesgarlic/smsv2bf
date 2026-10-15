import SectionWrapper from "../components/SectionWrapper";
import Button from "../components/Button";
import { LINKS } from "../lib/links";

const moduleGroups = [
  {
    category: "Core Academics",
    modules: [
      {
        title: "Academic",
        description: "Manage academic years, terms, grade levels, streams, and timetables. Supports multi-track calendars.",
        features: ["Academic year & term management", "Timetable generation", "Grade & stream setup", "Venue management"],
      },
      {
        title: "Curriculum",
        description: "CBC-aligned learning areas, strands, sub-strands, and learning outcomes. Configurable per grade.",
        features: ["CBC learning areas", "Strand & sub-strand mapping", "Learning outcomes per grade", "Curriculum browser for teachers"],
      },
      {
        title: "Assessment",
        description: "CBC formative and summative assessments with competency tracking. Customizable rubrics and report cards.",
        features: ["Formative & summative assessments", "Competency-based rubrics", "Result entry & approval", "Report card generation"],
      },
      {
        title: "Attendance",
        description: "Daily attendance marking, bulk entry, and analytics. Supports class and hostel attendance.",
        features: ["Daily class attendance", "Bulk attendance entry", "Attendance reports", "Hostel roll call"],
      },
    ],
  },
  {
    category: "People Management",
    modules: [
      {
        title: "Students",
        description: "End-to-end student management from admission to graduation. Bulk admit, transfer, and promote.",
        features: ["Student admission (individual & bulk)", "Enrollment & transfer tracking", "Student profiles with health records", "NEMIS integration"],
      },
      {
        title: "Staff",
        description: "Staff onboarding, role assignment, learning area allocation, and appraisal management.",
        features: ["Staff onboarding", "Learning area assignment", "Performance appraisals", "Leave management"],
      },
      {
        title: "Communication",
        description: "Bulk SMS, announcements, push notifications, and parent-teacher messaging.",
        features: ["Bulk SMS via Africa's Talking", "School announcements", "Push notifications", "Parent messaging"],
      },
    ],
  },
  {
    category: "Finance & Operations",
    modules: [
      {
        title: "Finance",
        description: "Complete financial management: fee structures, M-Pesa integration, receipts, waivers, and reports.",
        features: ["Fee structure management", "M-Pesa payment integration", "Receipt generation", "Fee waivers & reports"],
      },
      {
        title: "Inventory",
        description: "Track laboratory equipment, ICT assets, kitchen supplies, and general stock across categories.",
        features: ["Multi-category inventory", "Stock in/out tracking", "Low-stock alerts", "Asset assignment"],
      },
      {
        title: "Transport",
        description: "Route management, vehicle tracking, driver assignments, and student pickup/drop-off tracking.",
        features: ["Route management", "Vehicle tracking", "Driver assignment", "Student pickup tracking"],
      },
      {
        title: "Hostel",
        description: "Boarding management with bed allocations, hostel attendance, and maintenance tracking.",
        features: ["Hostel & room management", "Bed allocation", "Hostel attendance", "Maintenance requests"],
      },
    ],
  },
  {
    category: "Support & Compliance",
    modules: [
      {
        title: "Library",
        description: "Book catalog, borrowing management, fines, and library analytics.",
        features: ["Book catalog management", "Borrowing & returns", "Fine tracking", "Library usage reports"],
      },
      {
        title: "Activities",
        description: "Co-curricular activity and club management with coordinator assignments and participation tracking.",
        features: ["Club & activity management", "Coordinator assignment", "Participation tracking", "Event scheduling"],
      },
      {
        title: "Compliance",
        description: "Data protection (ODPC), consent management, breach logging, and audit trails for regulatory compliance.",
        features: ["Data consent management", "Breach incident logging", "Audit trails", "ODPC report generation"],
      },
      {
        title: "Reports",
        description: "Executive dashboards, governance portals, NEMIS exports, and custom report generation.",
        features: ["Executive dashboards", "Governance portal", "NEMIS CSV/XML export", "Custom report builder"],
      },
    ],
  },
];

export default function ModulesPage() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight">All Modules</h1>
          <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
            CBC SchoolMS offers 15 integrated modules covering every aspect of
            school management. Each module works independently or together as a
            complete platform — you choose what fits your school.
          </p>
        </div>
      </SectionWrapper>

      {moduleGroups.map((group) => (
        <SectionWrapper key={group.category} className="!py-24">
          <div>
            <h2 className="text-2xl font-bold">{group.category}</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {group.modules.map((mod) => (
              <div key={mod.title}>
                <h3 className="text-sm font-semibold">{mod.title}</h3>
                <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{mod.description}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {mod.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/50">
                      <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionWrapper>
      ))}

      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold">Need a Custom Combination?</h2>
          <p className="mt-3 text-foreground/60">
            Schools can mix and match modules based on their needs. Talk to our
            team and we will help you build the right plan.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="primary" href={LINKS.contact}>Book a Demo</Button>
            <Button variant="outline" href={LINKS.contact}>Contact Sales</Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
