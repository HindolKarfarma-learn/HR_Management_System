import { CalendarCheck2, HeartPulse, Palmtree } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const config = {
  annual: { label: 'Annual leave', icon: Palmtree, color: 'bg-blue-50 text-blue-600' },
  sick: { label: 'Sick leave', icon: HeartPulse, color: 'bg-rose-50 text-rose-600' },
  casual: { label: 'Casual leave', icon: CalendarCheck2, color: 'bg-amber-50 text-amber-600' },
};

export function LeaveBalance({ balance }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(balance || {}).map(([key, value]) => {
        const item = config[key];
        const Icon = item.icon;
        const available = value.total - value.used;
        return (
          <Card key={key} className="p-5">
            <div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-xl ${item.color}`}><Icon className="size-5" /></span><span className="text-xs text-slate-400">{value.used} used</span></div>
            <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{available} <span className="text-sm font-medium text-slate-400">of {value.total} days</span></p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(available / value.total) * 100}%` }} /></div>
          </Card>
        );
      })}
    </div>
  );
}
