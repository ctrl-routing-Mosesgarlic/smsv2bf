import { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      )}
      <p className="text-text-secondary text-center max-w-sm mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
