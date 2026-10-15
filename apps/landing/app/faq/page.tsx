import SectionWrapper from "../components/SectionWrapper";
import Button from "../components/Button";
import { LINKS } from "../lib/links";

const categories = [
  {
    title: "Getting Started",
    items: [
      { q: "How do I start a free trial?", a: "Click 'Start Free Trial' on any pricing plan. You will be prompted to create an account and set up your school profile. No credit card is required, and you get full access to all features for 14 days." },
      { q: "Do I need to download any software?", a: "No. CBC SchoolMS is a web-based platform that works in any modern browser. Teachers, parents, and students can access it from any device with an internet connection." },
      { q: "How long does onboarding take?", a: "Most schools are up and running within a week. Our customer success team provides guided onboarding, and we offer training sessions for staff." },
    ],
  },
  {
    title: "Billing & Plans",
    items: [
      { q: "Can I switch plans later?", a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately, while downgrades apply at the start of the next billing cycle." },
      { q: "What payment methods do you accept?", a: "We accept M-Pesa, bank transfers, and card payments. Schools on annual plans receive a 15% discount." },
      { q: "Is there a long-term contract?", a: "No. All plans are month-to-month with no long-term commitment. You can cancel anytime with no penalties." },
    ],
  },
  {
    title: "Platform",
    items: [
      { q: "Is my data secure?", a: "Yes. We encrypt all data at rest and in transit. We comply with ODPC guidelines, conduct regular security audits, and perform automated daily backups." },
      { q: "Can I export my data?", a: "Absolutely. You can export student records, financial reports, and assessment data in CSV, Excel, or PDF format at any time." },
      { q: "Does it work offline?", a: "The platform requires an internet connection for real-time features. However, teachers can offline-enter assessments that sync automatically when connectivity is restored." },
    ],
  },
  {
    title: "CBC & Compliance",
    items: [
      { q: "Is the platform aligned with CBC?", a: "Yes. CBC SchoolMS is built from the ground up for the Competency-Based Curriculum. All assessment formats, rubrics, and reporting structures follow KICD guidelines." },
      { q: "Does it integrate with NEMIS?", a: "Yes. You can generate NEMIS-compliant CSV and XML exports directly from the platform." },
      { q: "How do you handle data protection?", a: "We have built-in consent management, breach incident logging, and full audit trails to comply with the Data Protection Act and ODPC regulations." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
            Everything you need to know about CBC SchoolMS. Still have questions? Get in touch.
          </p>
        </div>
      </SectionWrapper>

      {categories.map((cat) => (
        <SectionWrapper key={cat.title} className="!py-24">
          <h2 className="text-2xl font-bold">{cat.title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((item) => (
              <div key={item.q}>
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      ))}

      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold">Still Have Questions?</h2>
          <p className="mt-3 text-foreground/60">
            Our team is here to help. Reach out and we will get back to you within 24 hours.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="primary" href={LINKS.contact}>Contact Us</Button>
            <Button variant="outline" href={LINKS.contact}>Book a Demo</Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
