import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CBC School Management System',
  description:
    'Comprehensive school management platform for Kenyan CBC curriculum schools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
