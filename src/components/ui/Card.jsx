import { cn } from '../../utils/cn';

export function Card({ children, className }) {
  return <section className={cn('rounded-xl border border-slate-200 bg-white shadow-card', className)}>{children}</section>;
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4', className)}>
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
