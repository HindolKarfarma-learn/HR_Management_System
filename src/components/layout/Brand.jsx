import { Blocks } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Brand({ compact = false }) {
  return (
    <Link to="/dashboard" className="flex items-center gap-3 rounded-lg">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm"><Blocks className="size-5" /></span>
      {!compact && (
        <span>
          <span className="block text-lg font-bold leading-5 text-slate-900">PeopleFlow</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">HR Management</span>
        </span>
      )}
    </Link>
  );
}
