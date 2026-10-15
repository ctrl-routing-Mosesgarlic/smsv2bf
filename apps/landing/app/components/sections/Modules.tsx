"use client"

import SectionWrapper from "../SectionWrapper"
import Button from "../Button"
import { LINKS } from "../../lib/links";
import { StackingCards } from "../StackingCards"

const moduleGroups = [
  {
    id: 1,
    category: "Manage your entire academic calendar and curriculum",
    description:
      "Manage academic years, terms, grade levels, CBC-aligned curricula, competency assessments, and daily attendance tracking.",
    image: "https://framerusercontent.com/images/MX3HNqrEJ01i4kqgdVnDkeXOVI.png?scale-down-to=1024&width=2216&height=1896",
    modules: ["Academic", "Curriculum", "Assessment", "Attendance"],
  },
  {
    id: 2,
    category: "Handle admissions, staff, and parent communication",
    description:
      "Handle student admissions, staff onboarding, learning area assignments, performance appraisals, and parent-teacher communication.",
    image: "https://framerusercontent.com/images/LVggzU8ChBFPgvtXEilJdK23PY.png?scale-down-to=1024&width=1108&height=948",
    modules: ["Students", "Staff", "Communication"],
  },
  {
    id: 3,
    category: "Streamline all finance and school operations",
    description:
      "Manage fee structures, M-Pesa payments, multi-category inventory, transport routes, and hostel boarding operations.",
    image: "https://framerusercontent.com/images/wiPH8LAYQR3ffg2hsJKuBoFS9wY.png?scale-down-to=1024&width=2216&height=1896",
    modules: ["Finance", "Inventory", "Transport", "Hostel"],
  },
  {
    id: 4,
    category: "Stay compliant and generate powerful reports",
    description:
      "Track library catalogues, co-curricular activities, ODPC compliance, and generate executive dashboards with NEMIS exports.",
    image: "https://framerusercontent.com/images/SMhyQZ0ZUQl7exxlOZUZtihso.png?scale-down-to=512&width=1284&height=1152",
    modules: ["Library", "Activities", "Compliance", "Reports"],
  },
]

export default function Modules() {
  return (
    <SectionWrapper className="!overflow-visible">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold">All Modules</h2>
        <p className="mt-3 max-w-2xl text-foreground/60">
          CBC SchoolMS offers 15 integrated modules covering every aspect of
          school management.
        </p>
      </div>

      <StackingCards className="mt-16">
        {moduleGroups.map((group) => (
          <div key={group.id} className={`flex w-full gap-8 bg-surface p-6 ${group.id % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            <div className="flex w-1/2 shrink-0 items-center justify-center overflow-hidden bg-surface">
              <img
                src={group.image}
                alt={group.category}
                className="h-full w-full object-cover border-[6px] border-white"
              />
            </div>
            <div className="flex w-1/2 flex-col justify-center">
              <h3 className="font-normal" style={{ fontSize: 34, lineHeight: 1.235 }}>{group.category}</h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/60">
                {group.description}
              </p>
              <Button variant="outline" href={LINKS.contact} className="mt-6 w-fit">Contact Sales</Button>
            </div>
          </div>
        ))}
      </StackingCards>
    </SectionWrapper>
  )
}
