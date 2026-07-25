import { Check, X } from "@phosphor-icons/react/dist/ssr";
import SectionWrapper from "../components/SectionWrapper";
import Button from "../components/Button";

const plans = [
  {
    title: "Basic",
    price: "KSh 2,500",
    period: "/month",
    description: "For small schools getting started with digital management.",
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
    description: "For growing schools that need more capacity and features.",
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
    description: "For large schools that need advanced features and analytics.",
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
    description: "For school groups and large institutions with unique requirements.",
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

const faq = [
  { q: "Can I switch plans later?", a: "Yes. You can upgrade or downgrade at any time. Changes take effect at the start of the next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept M-Pesa, bank transfers, and card payments. Annual plans qualify for a discount." },
  { q: "Do I need to sign a long-term contract?", a: "No. All plans are month-to-month with no long-term commitment. You can cancel anytime." },
  { q: "Can I try before I buy?", a: "Every plan includes a 14-day free trial with full access to all features. No credit card required." },
  { q: "What kind of support do you offer?", a: "All plans include support. Basic gets community support, Standard gets email, Premium gets priority, and Enterprise gets a dedicated support team." },
  { q: "Is my data secure?", a: "Yes. We use encryption at rest and in transit. We are compliant with ODPC guidelines and conduct regular security audits." },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
            Choose the plan that fits your school. All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.title} className="flex flex-col">
              <h3 className="text-sm font-semibold">
                {plan.title}
                {plan.popular && (
                  <span className="ml-2 text-xs font-medium text-teal-600">Most Popular</span>
                )}
              </h3>
              <p className="mt-1 text-sm text-foreground/50">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-sm text-foreground/40">{plan.period}</span>}
              </div>
              <ul className="mt-6 mb-6 flex flex-col gap-1.5">
                {plan.highlights.map((h) => (
                  <li key={h} className="text-sm text-foreground/60">{h}</li>
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
                      <span className={f.included ? "text-foreground/60" : "text-foreground/30"}>
                        {f.label}
                        {f.note && <span className="text-foreground/40"> ({f.note})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant={plan.popular ? "primary" : "ghost"} className="mt-auto">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {faq.map((item) => (
            <div key={item.q}>
              <h3 className="text-sm font-semibold">{item.q}</h3>
              <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
