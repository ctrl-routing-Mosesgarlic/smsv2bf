import Link from 'next/link';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@cbc/config/routes';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={PUBLIC_ROUTES.home} className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CBC</span>
              </div>
              <span className="font-semibold text-gray-900">SchoolMS</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href={PUBLIC_ROUTES.about} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href={PUBLIC_ROUTES.modules} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Modules
              </Link>
              <Link href={PUBLIC_ROUTES.pricing} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href={PUBLIC_ROUTES.contact} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href={AUTH_ROUTES.login}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={AUTH_ROUTES.register}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CBC</span>
                </div>
                <span className="font-semibold text-white">SchoolMS</span>
              </div>
              <p className="text-sm text-gray-400">
                Comprehensive school management platform designed for the Kenyan CBC curriculum.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href={PUBLIC_ROUTES.about} className="text-sm hover:text-white transition-colors">About</Link></li>
                <li><Link href={PUBLIC_ROUTES.modules} className="text-sm hover:text-white transition-colors">Modules</Link></li>
                <li><Link href={PUBLIC_ROUTES.pricing} className="text-sm hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href={PUBLIC_ROUTES.contact} className="text-sm hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Modules</h3>
              <ul className="space-y-2">
                <li><span className="text-sm">Academic</span></li>
                <li><span className="text-sm">Finance</span></li>
                <li><span className="text-sm">Assessment</span></li>
                <li><span className="text-sm">Communication</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@schoolms.com</li>
                <li>+254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CBC SchoolMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
