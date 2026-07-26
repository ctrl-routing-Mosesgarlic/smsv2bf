import SectionWrapper from "../components/SectionWrapper";
import Button from "../components/Button";

const team = [
  { name: "Dr. Jane Kimani", role: "CEO & Co-Founder", bio: "Former principal with 20 years in Kenyan education. Led the CBC transition at three national schools." },
  { name: "Kevin Omondi", role: "CTO & Co-Founder", bio: "Software engineer specialising in ed-tech platforms. Previously built assessment tools for KICD." },
  { name: "Faith Nyambura", role: "Head of Product", bio: "Product leader focused on making school management intuitive for non-technical staff." },
  { name: "Samuel Kiprop", role: "Head of Engineering", bio: "Leads the engineering team building scalable infrastructure for multi-school deployments." },
  { name: "Grace Wanjiku", role: "Head of Customer Success", bio: "Ensures every school gets the most out of the platform with tailored onboarding and training." },
  { name: "David Mwangi", role: "Head of Sales", bio: "Helps schools across Kenya find the right plan and module setup for their specific needs." },
];

const milestones = [
  { year: "2023", title: "Founded", description: "CBC SchoolMS was founded by educators and engineers who saw the gap in CBC-aligned school management tools." },
  { year: "2024", title: "First 50 Schools", description: "Onboarded 50 schools across Nairobi, Mombasa, and Kisumu. Launched M-Pesa integration and NEMIS export." },
  { year: "2025", title: "200 Schools & 15 Modules", description: "Expanded to 200 schools and launched all 15 modules. Introduced multi-school management for school groups." },
  { year: "2026", title: "500+ Schools", description: "Now serving over 500 schools across Kenya and East Africa. Launched parent portal and advanced analytics." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold leading-tight">About CBC SchoolMS</h1>
          <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
            We are building the operating system for Kenyan schools. Our platform
            digitises every aspect of school management — from admissions and
            CBC-aligned assessments to M-Pesa fee collection and compliance
            reporting — so educators can focus on what matters most: student
            development.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              To empower every Kenyan school with technology that simplifies
              administration, enhances learning outcomes, and ensures compliance
              with national education standards. We believe great software should
              not be a luxury reserved for well-funded private schools — every
              school, regardless of size or budget, deserves tools that make
              their work easier.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              CBC SchoolMS was born in 2023 when our founders — a school
              principal and a software engineer — realised that existing school
              management systems were built for the 8-4-4 system and could not
              handle the Competency-Based Curriculum. They set out to build a
              platform purpose-built for CBC from the ground up. What started as
              a tool for one school grew into a comprehensive platform now used
              by hundreds of schools across Kenya.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our Journey</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div key={m.year}>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground/20">{m.year}</span>
                <span className="text-sm font-semibold">{m.title}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="mt-2 text-foreground/60">The people behind CBC SchoolMS</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.name}>
              <div className="aspect-[4/3] w-full bg-surface border border-border flex items-center justify-center text-foreground/20 text-sm">
                Photo
              </div>
              <h3 className="mt-4 text-sm font-semibold">{member.name}</h3>
              <p className="text-sm text-foreground/50">{member.role}</p>
              <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our Values</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Student First", desc: "Every decision we make starts with the question: does this help students learn better?" },
            { title: "CBC Native", desc: "We do not bolt CBC onto existing systems. Our platform is built from the ground up for the Competency-Based Curriculum." },
            { title: "Kenya Built", desc: "Built in Nairobi for Kenyan schools. We understand the local context, regulations, and infrastructure challenges." },
            { title: "Simple by Design", desc: "Powerful software does not have to be complicated. We obsess over simplicity so teachers can focus on teaching." },
            { title: "Continuous Improvement", desc: "Schools evolve, curricula change, and technology advances. We continuously improve the platform based on real feedback." },
            { title: "Every School Matters", desc: "Whether you have 50 students or 50,000, you deserve great software at a fair price." },
          ].map((value) => (
            <div key={value.title}>
              <h3 className="text-sm font-semibold">{value.title}</h3>
              <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="!py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold">Want to Know More?</h2>
          <p className="mt-3 text-foreground/60">
            Book a demo or reach out to our team. We would love to show you how
            CBC SchoolMS can transform your school.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="primary">Book a Demo</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
