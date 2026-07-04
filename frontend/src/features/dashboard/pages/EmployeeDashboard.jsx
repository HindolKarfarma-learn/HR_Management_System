import dayjs from 'dayjs';
import { CalendarCheck, CircleDollarSign, Clock3, Palmtree } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Calendar } from '../../../components/ui/Calendar';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { StatCard } from '../../../components/cards/StatCard';
import { ChartCard } from '../../../components/cards/ChartCard';
import { AttendanceChart } from '../components/AttendanceChart';
import { ActivityList } from '../components/ActivityList';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function EmployeeDashboard({ data }) {
  const employee = data.employee;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Profile completion" value={`${employee.profileCompletion}%`} detail="Keep your details current" icon={Clock3} color="blue" />
        <StatCard title="Today's attendance" value="8h 12m" detail="Checked in at 9:08 AM" icon={CalendarCheck} color="green" />
        <StatCard title="Annual leave" value={`${employee.leaveBalance.annual} days`} detail="available this year" icon={Palmtree} color="amber" />
        <StatCard title="Latest salary" value={currency.format(employee.salary.netPay)} detail={`${employee.salary.month} · ${employee.salary.status}`} icon={CircleDollarSign} color="violet" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <ChartCard title="My attendance" description="Monthly attendance percentage"><AttendanceChart data={data.attendanceTrend} /></ChartCard>
        <Card><CardHeader title="Calendar" description={dayjs().format('MMMM YYYY')} /><CardContent><Calendar selected={dayjs()} markers={data.holidays.map((holiday) => dayjs(holiday.date))} /></CardContent></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader title="Recent activity" /><CardContent><ActivityList activities={data.activities} /></CardContent></Card>
        <Card>
          <CardHeader title="Upcoming holidays" action={<Button as={Link} to="/leave" size="sm" variant="ghost">View calendar</Button>} />
          <CardContent className="space-y-4">
            {data.holidays.map((holiday) => (
              <div key={holiday.date} className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-center text-brand-700"><span><strong className="block text-sm">{dayjs(holiday.date).format('DD')}</strong><span className="text-[10px] uppercase">{dayjs(holiday.date).format('MMM')}</span></span></span>
                <div><p className="text-sm font-semibold text-slate-800">{holiday.name}</p><p className="text-xs text-slate-500">{holiday.day}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
