import Link from 'next/link';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@cbc/config/routes';

export default function LandingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Complete School Management for the CBC Curriculum
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              From admissions to report cards, manage every aspect of your school
              with one integrated platform built for Kenya&apos;s Competency-Based
              Curriculum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={AUTH_ROUTES.register}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href={PUBLIC_ROUTES.modules}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Modules
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Why CBC SchoolMS?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Built specifically for Kenyan schools implementing the Competency-Based Curriculum
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'CBC-Aligned Assessments',
                desc: 'Pre-configured with CBC assessment formats: formative, summative, and competency-based rubrics.',
              },
              {
                title: 'Multi-School Management',
                desc: 'Manage a single school or an entire group of schools from one centralized dashboard.',
              },
              {
                title: 'Real-Time Analytics',
                desc: 'Track student performance, attendance, and financial health with live dashboards.',
              },
              {
                title: 'Integrated Finance',
                desc: 'Fee structures, M-Pesa payments, receipts, and financial reports all in one place.',
              },
              {
                title: 'Parent & Student Portal',
                desc: 'Parents can track fees, results, and attendance. Students access their own learning data.',
              },
              {
                title: 'Kenya-Ready Compliance',
                desc: 'NEMIS integration, data protection (ODPC), and audit trails built in.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Schools Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'CBC SchoolMS transformed how we manage assessments. The CBC rubrics saved us weeks of setup time.',
                author: 'Dr. Jane Kimani',
                role: 'Principal, Riara Springs Academy',
              },
              {
                quote:
                  'The integrated M-Pesa payments reduced our fee collection time by 60%. Parents love the convenience.',
                author: 'Peter Ochieng',
                role: 'Bursar, Muthaiga School',
              },
              {
                quote:
                  'Managing 12 schools under one platform seemed impossible until we found CBC SchoolMS.',
                author: 'Sarah Wanjiku',
                role: 'Group Admin, Bridge Schools Kenya',
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="p-6 bg-white rounded-xl border border-gray-200"
              >
                <p className="text-gray-600 italic mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of Kenyan schools already using CBC SchoolMS.
          </p>
          <Link
            href={AUTH_ROUTES.register}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
