import { useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SearchBar } from '../../../components/forms/SearchBar';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Calendar } from '../../../components/ui/Calendar';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { useAuthStore } from '../../../store/authStore';
import { ApplyLeaveForm } from '../components/ApplyLeaveForm';
import { LeaveActions } from '../components/LeaveActions';
import { LeaveBalance } from '../components/LeaveBalance';
import { useLeaveActions, useLeaveBalance, useLeaveRequests } from '../hooks/useLeave';

const variants = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

export default function LeavePage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user.role === 'admin';
  const [applyOpen, setApplyOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, pageSize: 10, sort: { key: 'appliedOn', direction: 'desc' } });
  const { data } = useLeaveRequests({ ...filters, employeeId: isAdmin ? undefined : user.id });
  const { data: balance } = useLeaveBalance();
  const { apply, updateStatus } = useLeaveActions();
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const sortBy = (key) => setFilters((current) => ({ ...current, sort: { key, direction: current.sort.key === key && current.sort.direction === 'asc' ? 'desc' : 'asc' } }));
  const review = (request, status) => updateStatus.mutate({ id: request.id, status, comments: status === 'Rejected' ? 'Please coordinate alternate dates with your manager.' : 'Approved by People Operations.' }, { onSuccess: () => toast.success(`Request ${status.toLowerCase()}`), onError: (error) => toast.error(error.message) });
  const submit = (values) => apply.mutate({ values, employee: user }, { onSuccess: () => { toast.success('Leave request submitted'); setApplyOpen(false); }, onError: (error) => toast.error(error.message) });
  const columns = [
    ...(isAdmin ? [{ key: 'employeeName', label: 'Employee', sortable: true, render: (value, row) => <div><p className="font-semibold text-slate-800">{value}</p><p className="text-xs text-slate-400">{row.department}</p></div> }] : []),
    { key: 'type', label: 'Leave type', sortable: true },
    { key: 'startDate', label: 'Dates', sortable: true, render: (_, row) => <div><p>{dayjs(row.startDate).format('DD MMM')} – {dayjs(row.endDate).format('DD MMM YYYY')}</p><p className="text-xs text-slate-400">{row.days} day(s)</p></div> },
    { key: 'reason', label: 'Reason', render: (value) => <span className="block max-w-48 truncate">{value}</span> },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={variants[value]}>{value}</Badge> },
    ...(isAdmin ? [{ key: 'actions', label: 'Actions', render: (_, row) => <LeaveActions request={row} onAction={review} loading={updateStatus.isPending} /> }] : []),
  ];
  const approvedDates = (data?.items || []).filter((item) => item.status === 'Approved').map((item) => dayjs(item.startDate));

  return (
    <>
      <PageHeader title="Leave" description={isAdmin ? 'Review requests and monitor team availability.' : 'Manage leave balances and time-off requests.'} action={!isAdmin && <Button onClick={() => setApplyOpen(true)}><Plus className="size-4" />Apply for leave</Button>} />
      {!isAdmin && <LeaveBalance balance={balance} />}
      <div className={`mt-6 grid gap-6 ${isAdmin ? '' : 'xl:grid-cols-[1fr_1.7fr]'}`}>
        {!isAdmin && <Card><CardHeader title="Leave calendar" description="Approved leave and holidays" /><CardContent><Calendar selected={dayjs()} markers={approvedDates} /></CardContent></Card>}
        <Card>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:justify-between">
            <div><h2 className="font-semibold text-slate-900">{isAdmin ? 'Leave approvals' : 'Leave history'}</h2><p className="mt-1 text-sm text-slate-500">{isAdmin ? 'Requests from across the organization' : 'Your submitted requests'}</p></div>
            <div className="flex gap-3">{isAdmin && <SearchBar value={filters.search} onChange={(value) => setFilter('search', value)} placeholder="Search employee…" className="w-52" />}<Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)} placeholder="All statuses" options={Object.keys(variants).map((value) => ({ value, label: value }))} className="w-36" /></div>
          </div>
          <DataTable columns={columns} data={data?.items || []} sort={filters.sort} onSort={sortBy} />
          <Pagination page={data?.page || 1} totalPages={data?.totalPages || 0} totalItems={data?.total || 0} pageSize={10} onPageChange={(page) => setFilter('page', page)} />
        </Card>
      </div>
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for leave" description="Submit your time-off request for manager approval."><ApplyLeaveForm onSubmit={submit} onCancel={() => setApplyOpen(false)} loading={apply.isPending} /></Modal>
    </>
  );
}
