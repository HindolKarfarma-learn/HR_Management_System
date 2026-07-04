import { CalendarOff, Clock3, Timer, UserRoundCheck } from 'lucide-react';
import { StatCard } from '../../../components/cards/StatCard';

export function AttendanceSummary({ summary }) {
  const stats = [
    { title: 'Present days', value: summary?.counts?.Present || 0, detail: 'this period', icon: UserRoundCheck, color: 'green' },
    { title: 'Average hours', value: `${summary?.averageHours || 0}h`, detail: 'per working day', icon: Timer, color: 'blue' },
    { title: 'Leave days', value: summary?.counts?.Leave || 0, detail: 'approved leave', icon: CalendarOff, color: 'amber' },
    { title: 'Absent days', value: summary?.counts?.Absent || 0, detail: 'this period', icon: Clock3, color: 'violet' },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</div>;
}
