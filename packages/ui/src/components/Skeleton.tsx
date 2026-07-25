interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const base = 'animate-pulse bg-border-default rounded';
  const variants = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };
  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-border-default rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border-default p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-border-default rounded w-1/3" />
      <div className="h-4 bg-border-default rounded w-full" />
      <div className="h-4 bg-border-default rounded w-5/6" />
      <div className="flex gap-2">
        <div className="h-8 bg-border-default rounded w-20" />
        <div className="h-8 bg-border-default rounded w-24" />
      </div>
    </div>
  );
}
