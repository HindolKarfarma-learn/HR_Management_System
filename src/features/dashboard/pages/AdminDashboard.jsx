import { CalendarDays, Clock3, UserRoundCheck, UsersRound } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { StatCard } from '../../../components/cards/StatCard';
import { ChartCard } from '../../../components/cards/ChartCard';
import { AttendanceChart } from '../components/AttendanceChart';
import { ActivityList } from '../components/ActivityList';

export default function AdminDashboard({ data }) {
  const stats = [
    { title: 'Total employees', value: data.stats.employeeCount, change: 8.2, detail: 'from last quarter', icon: UsersRound, color: 'blue' },
    { title: 'Present today', value: data.stats.presentToday, change: 2.4, detail: '84% attendance', icon: UserRoundCheck, color: 'green' },
    { title: 'On leave', value: data.stats.onLeave, change: -1.8, detail: 'across 4 teams', icon: CalendarDays, color: 'amber' },
    { title: 'Pending requests', value: data.stats.pendingRequests, change: 4.1, detail: 'needs attention', icon: Clock3, color: 'violet' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <ChartCard title="Attendance overview" description="Organization-wide monthly attendance"><AttendanceChart data={data.attendanceTrend} /></ChartCard>
        <Card><CardHeader title="Recent activity" description="Latest updates across PeopleFlow" /><CardContent><ActivityList activities={data.activities} /></CardContent></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Recent employees" description="Newest additions to your workforce" />
          <div className="divide-y divide-slate-100">
            {data.recentEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={employee.name} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{employee.name}</p><p className="truncate text-xs text-slate-500">{employee.designation} · {employee.department}</p></div>
                <Badge variant="success">{employee.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Pending leave requests" description="Requests awaiting review" />
          <div className="divide-y divide-slate-100">
            {data.pendingLeave.map((request) => (
              <div key={request.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={request.employeeName} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{request.employeeName}</p><p className="text-xs text-slate-500">{request.type} · {request.days} day(s)</p></div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
