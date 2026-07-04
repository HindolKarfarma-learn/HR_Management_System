import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';

export function StatCard({ title, value, change, icon: Icon, color = 'blue', detail }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  const positive = Number(change) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-xl ${colors[color]}`}><Icon className="size-5" /></span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span className={`inline-flex items-center font-semibold ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />} {Math.abs(change)}%
          </span>
        )}
        <span className="text-slate-500">{detail}</span>
      </div>
    </Card>
  );
}
