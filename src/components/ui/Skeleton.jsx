import { cn } from '../../utils/cn';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} aria-hidden="true" />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading content">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-32" />)}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
