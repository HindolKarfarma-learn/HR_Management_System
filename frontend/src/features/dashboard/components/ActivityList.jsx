import { CalendarCheck, CircleDollarSign, UserPlus, Waves } from 'lucide-react';

const icons = { attendance: CalendarCheck, payroll: CircleDollarSign, employee: UserPlus, leave: Waves };

export function ActivityList({ activities }) {
  return (
    <div className="divide-y divide-slate-100">
      {activities.map((activity) => {
        const Icon = icons[activity.type] || CalendarCheck;
        return (
          <div key={activity.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon className="size-4" /></span>
            <div><p className="text-sm text-slate-700">{activity.text}</p><p className="mt-1 text-xs text-slate-400">{activity.time}</p></div>
          </div>
        );
      })}
    </div>
  );
}
