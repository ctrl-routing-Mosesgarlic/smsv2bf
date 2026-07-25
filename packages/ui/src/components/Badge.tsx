import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-surface-muted text-text-secondary',
  info: 'bg-info-light text-info',
};

export function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
