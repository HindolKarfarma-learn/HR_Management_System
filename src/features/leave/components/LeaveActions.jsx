import { Check, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function LeaveActions({ request, onAction, loading }) {
  if (request.status !== 'Pending') return <span className="text-xs text-slate-400">Reviewed</span>;
  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => onAction(request, 'Approved')} loading={loading}><Check className="size-3.5" />Approve</Button>
      <Button size="sm" variant="secondary" onClick={() => onAction(request, 'Rejected')}><X className="size-3.5" />Reject</Button>
    </div>
  );
}
