import { Check, X } from "@phosphor-icons/react/dist/ssr";
import SectionWrapper from "../SectionWrapper";
import Button from "../Button";
import { cn } from "../../lib/utils";

type Feature = { label: string; included: boolean; note?: string };

type Plan = {
  title: string;
  price: string;
  period: string;
  popular?: boolean;
  highlights: string[];
  features: Feature[];
  cta: string;
};

const plans: Plan[] = [
  {
    title: "Basic",
    price: "KSh 2,500",
    period: "/month",
    highlights: ["Up to 500 students", "Up to 50 users", "Up to 30 teachers", "2 GB storage"],
    features: [
      { label: "SMS Alerts", included: true },
      { label: "SMS Messages Included", included: true, note: "200 /mo" },
      { label: "Custom Domain", included: false },
      { label: "API Access", included: false },
      { label: "Priority Support", included: false },
      { label: "Support Experience", included: true, note: "Community" },
      { label: "Advanced Analytics", included: false },
      { label: "White Labelling", included: false },
      { label: "Dedicated Support", included: false },
      { label: "M-Pesa Integration", included: true },
      { label: "Bank Reconciliation", included: false },
      { label: "Multi-School Management", included: false },
    ],
    cta: "Start Free Trial",
  },
  {
    title: "Standard",
    price: "KSh 5,000",
    period: "/month",
    popular: true,
    highlights: ["Up to 2,000 students", "Up to 200 users", "Up to 100 teachers", "10 GB storage"],
    features: [
      { label: "SMS Alerts", included: true },
      { label: "SMS Messages Included", included: true, note: "500 /mo" },
      { label: "Custom Domain", included: false },
      { label: "API Access", included: false },
      { label: "Priority Support", included: false },
      { label: "Support Experience", included: true, note: "Email Support" },
      { label: "Advanced Analytics", included: false },
      { label: "White Labelling", included: false },
      { label: "Dedicated Support", included: false },
      { label: "M-Pesa Integration", included: true },
      { label: "Bank Reconciliation", included: true },
      { label: "Multi-School Management", included: true },
    ],
    cta: "Start Free Trial",
  },
  {
    title: "Premium",
    price: "KSh 12,000",
    period: "/month",
    highlights: ["Up to 10,000 students", "Up to 1,000 users", "Up to 500 teachers", "50 GB storage"],
    features: [
      { label: "SMS Alerts", included: true },
      { label: "SMS Messages Included", included: true, note: "2,000 /mo" },
      { label: "Custom Domain", included: true, note: "Up to 3" },
      { label: "API Access", included: true },
      { label: "Priority Support", included: true },
      { label: "Support Experience", included: true, note: "Priority" },
      { label: "Advanced Analytics", included: true },
      { label: "White Labelling", included: false },
      { label: "Dedicated Support", included: false },
      { label: "M-Pesa Integration", included: true },
      { label: "Bank Reconciliation", included: true },
      { label: "Multi-School Management", included: true },
    ],
    cta: "Start Free Trial",
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "",
    highlights: ["Up to 500,000 students", "Up to 50,000 users", "Up to 10,000 teachers", "1 TB storage"],
    features: [
      { label: "SMS Alerts", included: true },
      { label: "SMS Messages Included", included: true, note: "Unlimited" },
      { label: "Custom Domain", included: true, note: "Unlimited" },
      { label: "API Access", included: true },
      { label: "Priority Support", included: true },
      { label: "Support Experience", included: true, note: "Dedicated" },
      { label: "Advanced Analytics", included: true },
      { label: "White Labelling", included: true },
      { label: "Dedicated Support", included: true },
      { label: "M-Pesa Integration", included: true },
      { label: "Bank Reconciliation", included: true },
      { label: "Multi-School Management", included: true },
    ],
    cta: "Contact Sales",
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  const buttonVariant = plan.popular ? "primary" : "outline";

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-semibold">
          {plan.title}
          {plan.popular && (
            <span className="ml-2 text-xs font-medium text-teal-600">Most Popular</span>
          )}
        </h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{plan.price}</span>
          {plan.period && <span className="text-sm text-foreground/40">{plan.period}</span>}
        </div>
      </div>
      <ul className="mb-6 flex flex-col gap-1.5">
        {plan.highlights.map((h) => (
          <li key={h} className="text-sm text-foreground/60">
            {h}
          </li>
        ))}
      </ul>
      <div className="mb-8 border-t border-border pt-6">
        <ul className="flex flex-col gap-3">
          {plan.features.map((f) => (
            <li key={f.label} className="flex items-start gap-2 text-sm">
              {f.included ? (
                <Check size={14} className="mt-0.5 shrink-0 text-foreground/40" />
              ) : (
                <X size={14} className="mt-0.5 shrink-0 text-foreground/20" />
              )}
              <span className={cn(f.included ? "text-foreground/60" : "text-foreground/30")}>
                {f.label}
                {f.note && <span className="text-foreground/40"> ({f.note})</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Button variant={buttonVariant} className="mt-auto">
        {plan.cta}
      </Button>
    </div>
  );
}

export default function Pricing() {
  return (
    <SectionWrapper>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold">Simple, Transparent Pricing</h2>
        <p className="mt-3 max-w-2xl text-foreground/60">
          Choose the plan that fits your school. All plans include a 14-day free
          trial. No credit card required.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard key={plan.title} plan={plan} />
        ))}
      </div>
    </SectionWrapper>
  );
}
