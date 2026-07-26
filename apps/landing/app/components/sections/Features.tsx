import {
  ClipboardText,
  Buildings,
  ChartBar,
  Wallet,
  UsersThree,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import SectionWrapper from "../SectionWrapper";

const features = [
  {
    icon: ClipboardText,
    title: "CBC-Aligned Assessments",
    description:
      "Pre-configured with CBC assessment formats: formative, summative, and competency-based rubrics.",
  },
  {
    icon: Buildings,
    title: "Multi-School Management",
    description:
      "Manage a single school or an entire group of schools from one centralized dashboard.",
  },
  {
    icon: ChartBar,
    title: "Real-Time Analytics",
    description:
      "Track student performance, attendance, and financial health with live dashboards.",
  },
  {
    icon: Wallet,
    title: "Integrated Finance",
    description:
      "Fee structures, M-Pesa payments, receipts, and financial reports all in one place.",
  },
  {
    icon: UsersThree,
    title: "Parent & Student Portal",
    description:
      "Parents can track fees, results, and attendance. Students access their own learning data.",
  },
  {
    icon: ShieldCheck,
    title: "Kenya-Ready Compliance",
    description:
      "NEMIS integration, data protection (ODPC), and audit trails built in.",
  },
];

export default function Features() {
  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold">Why CBC SchoolMS?</h2>
        <p className="mt-3 text-foreground/60">
          Built specifically for Kenyan schools implementing the Competency-Based
          Curriculum
        </p>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-x-16 gap-y-12">
        {features.map((feature) => (
          <div key={feature.title}>
            <feature.icon size={28} className="text-foreground/40" />
            <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
            <p className="mt-1 text-base text-foreground/60 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
