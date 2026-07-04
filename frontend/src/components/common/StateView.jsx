import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({ title = 'Nothing here yet', description = 'There are no records to display.', action }) {
  return (
    <div className="grid min-h-52 place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500"><Inbox /></span>
        <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({ title = 'Unable to load data', description = 'Please try again in a moment.', onRetry }) {
  return (
    <div className="grid min-h-52 place-items-center p-6 text-center" role="alert">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600"><AlertCircle /></span>
        <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        {onRetry && <Button className="mt-4" variant="secondary" onClick={onRetry}>Try again</Button>}
      </div>
    </div>
  );
}
