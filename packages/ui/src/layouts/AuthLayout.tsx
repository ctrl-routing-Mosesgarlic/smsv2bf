import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  logo?: ReactNode;
  size?: 'sm' | 'md';
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
};

export function AuthLayout({ children, title, subtitle, logo, size = 'sm' }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-8">
      <div className={`w-full ${sizeMap[size]}`}>
        {(logo || title) && (
          <div className="text-center mb-8">
            {logo || (
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-on-primary font-bold text-lg">CBC</span>
              </div>
            )}
            {title && (
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
          </div>
        )}
        <div className="bg-surface p-6 rounded-xl shadow-md border border-border-default">
          {children}
        </div>
      </div>
    </div>
  );
}
