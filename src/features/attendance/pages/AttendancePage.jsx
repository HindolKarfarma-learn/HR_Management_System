import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Clock3, LogIn, LogOut } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SearchBar } from '../../../components/forms/SearchBar';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Calendar } from '../../../components/ui/Calendar';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { ErrorState } from '../../../components/common/StateView';
import { useAuthStore } from '../../../store/authStore';
import { AttendanceSummary } from '../components/AttendanceSummary';
import { WorkHoursChart } from '../components/WorkHoursChart';
import { useAttendance, useAttendanceActions, useAttendanceSummary } from '../hooks/useAttendance';

const variants = { Present: 'success', Absent: 'danger', 'Half Day': 'warning', Leave: 'info' };

export default function AttendancePage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user.role === 'admin';
  const [view, setView] = useState('Monthly');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, pageSize: 10, sort: { key: 'date', direction: 'desc' } });
  const params = { ...filters, employeeId: isAdmin ? undefined : user.id, date: selectedDate?.format('YYYY-MM-DD') || '' };
  const { data, isError, refetch } = useAttendance(params);
  const { data: summary } = useAttendanceSummary(isAdmin ? 'EMP-1001' : user.id);
  const { checkIn, checkOut } = useAttendanceActions();
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const sortBy = (key) => setFilters((current) => ({ ...current, sort: { key, direction: current.sort.key === key && current.sort.direction === 'asc' ? 'desc' : 'asc' } }));
  const action = (type) => {
    const mutation = type === 'in' ? checkIn : checkOut;
    mutation.mutate(type === 'in' ? user : user.id, { onSuccess: () => toast.success(`Checked ${type} successfully`), onError: (error) => toast.error(error.message) });
  };
  const columns = useMemo(() => [
    ...(isAdmin ? [{ key: 'employeeName', label: 'Employee', sortable: true, render: (value, row) => <div><p className="font-semibold text-slate-800">{value}</p><p className="text-xs text-slate-400">{row.employeeId}</p></div> }] : []),
    { key: 'date', label: 'Date', sortable: true, render: (value) => dayjs(value).format('DD MMM YYYY') },
    { key: 'checkIn', label: 'Check in', render: (value) => value || '—' },
    { key: 'checkOut', label: 'Check out', render: (value) => value || '—' },
    { key: 'workHours', label: 'Work hours', sortable: true, render: (value) => `${value}h` },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={variants[value]}>{value}</Badge> },
  ], [isAdmin]);

  return (
    <>
      <PageHeader title="Attendance" description={isAdmin ? 'Monitor attendance, hours, and workforce availability.' : 'Track your work hours and attendance history.'} action={!isAdmin && <div className="flex gap-2"><Button variant="secondary" onClick={() => action('in')} loading={checkIn.isPending}><LogIn className="size-4" />Check in</Button><Button onClick={() => action('out')} loading={checkOut.isPending}><LogOut className="size-4" />Check out</Button></div>} />
      <AttendanceSummary summary={summary} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <Card><CardHeader title="Attendance calendar" description="Select a date to filter records" /><CardContent><Calendar selected={selectedDate || dayjs()} onSelect={setSelectedDate} markers={(data?.items || []).filter((item) => item.status === 'Leave').map((item) => dayjs(item.date))} /><Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => setSelectedDate(null)}>Clear selected date</Button></CardContent></Card>
        <Card><CardHeader title="Weekly hours" description="Hours recorded over the latest seven days" /><CardContent><WorkHoursChart records={data?.items || []} /></CardContent></Card>
      </div>
      <Card className="mt-6">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 lg:flex-row">
          <div className="flex rounded-lg bg-slate-100 p-1">{['Daily', 'Weekly', 'Monthly'].map((item) => <button type="button" key={item} onClick={() => setView(item)} className={`rounded-md px-4 py-2 text-sm font-medium ${view === item ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{item}</button>)}</div>
          <div className="flex gap-3">{isAdmin && <SearchBar value={filters.search} onChange={(value) => setFilter('search', value)} placeholder="Search employee…" className="w-56" />}<Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)} placeholder="All statuses" options={Object.keys(variants).map((value) => ({ value, label: value }))} className="w-36" /></div>
        </div>
        {isError ? <ErrorState onRetry={refetch} /> : <><DataTable columns={columns} data={data?.items || []} sort={filters.sort} onSort={sortBy} /><Pagination page={data?.page || 1} totalPages={data?.totalPages || 0} totalItems={data?.total || 0} pageSize={10} onPageChange={(page) => setFilter('page', page)} /></>}
      </Card>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Clock3 className="size-3.5" />Showing {view.toLowerCase()} attendance view.</p>
    </>
  );
}
