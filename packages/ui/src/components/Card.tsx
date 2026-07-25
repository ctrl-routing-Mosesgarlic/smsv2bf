import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  actions,
  className = '',
}: CardProps) {
  return (
    <div className={`bg-surface rounded-xl shadow-md border border-border-default ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-border-default">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border-default bg-surface-muted rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}
