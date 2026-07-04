import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Banknote, Download, Pencil, ReceiptIndianRupee, WalletCards } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SearchBar } from '../../../components/forms/SearchBar';
import { StatCard } from '../../../components/cards/StatCard';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { PageSkeleton } from '../../../components/ui/Skeleton';
import { useAuthStore } from '../../../store/authStore';
import { SalaryChart } from '../components/SalaryChart';
import { SalaryForm } from '../components/SalaryForm';
import { usePayroll, usePayrollActions, useSalaryDetails } from '../hooks/usePayroll';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function PayrollPage() {
  const user = useAuthStore((state) => state.user);
  return user.role === 'admin' ? <AdminPayroll /> : <EmployeePayroll employeeId={user.id} />;
}

function EmployeePayroll({ employeeId }) {
  const { data: salary, isLoading } = useSalaryDetails(employeeId);
  const { download } = usePayrollActions();
  if (isLoading) return <PageSkeleton />;
  const downloadPayslip = () => download.mutate(employeeId, { onSuccess: ({ message }) => toast.success(message) });
  return (
    <>
      <PageHeader title="Payroll" description="Review your compensation and monthly payslips." action={<Button onClick={downloadPayslip} loading={download.isPending}><Download className="size-4" />Download payslip</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Gross salary" value={money.format(salary.gross)} detail={salary.month} icon={Banknote} color="blue" />
        <StatCard title="Deductions" value={money.format(salary.deductions)} detail="tax and contributions" icon={ReceiptIndianRupee} color="amber" />
        <StatCard title="Net pay" value={money.format(salary.netPay)} detail={salary.status} icon={WalletCards} color="green" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><CardHeader title="Salary composition" description="Your monthly earnings breakdown" /><CardContent><SalaryChart salary={salary} /></CardContent></Card>
        <Card><CardHeader title="Salary breakdown" description={salary.month} /><CardContent className="space-y-4">{['basic', 'hra', 'allowances', 'variable', 'gross', 'deductions', 'netPay'].map((key) => <div key={key} className={`flex justify-between border-b border-slate-100 pb-3 text-sm ${key === 'netPay' ? 'font-bold text-slate-900' : ''}`}><span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span><span>{money.format(salary[key])}</span></div>)}</CardContent></Card>
      </div>
    </>
  );
}

function AdminPayroll() {
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, pageSize: 10, sort: { key: 'employeeName', direction: 'asc' } });
  const [editing, setEditing] = useState(null);
  const { data } = usePayroll(filters);
  const { update } = usePayrollActions();
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const sortBy = (key) => setFilters((current) => ({ ...current, sort: { key, direction: current.sort.key === key && current.sort.direction === 'asc' ? 'desc' : 'asc' } }));
  const columns = useMemo(() => [
    { key: 'employeeName', label: 'Employee', sortable: true, render: (value, row) => <div><p className="font-semibold text-slate-800">{value}</p><p className="text-xs text-slate-400">{row.employeeId}</p></div> },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'gross', label: 'Gross salary', sortable: true, render: (value) => money.format(value) },
    { key: 'deductions', label: 'Deductions', render: (value) => money.format(value) },
    { key: 'netPay', label: 'Net pay', sortable: true, render: (value) => <strong className="text-slate-800">{money.format(value)}</strong> },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={value === 'Paid' ? 'success' : 'warning'}>{value}</Badge> },
    { key: 'actions', label: '', render: (_, row) => <Button size="sm" variant="ghost" onClick={() => setEditing(row)}><Pencil className="size-4" />Edit</Button> },
  ], []);
  const save = (values) => update.mutate({ employeeId: editing.employeeId, values }, { onSuccess: () => { toast.success('Salary updated'); setEditing(null); } });
  return (
    <>
      <PageHeader title="Payroll" description="Manage employee compensation and monthly payroll." />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:justify-between">
          <SearchBar value={filters.search} onChange={(value) => setFilter('search', value)} placeholder="Search employee…" className="w-full sm:max-w-sm" />
          <Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)} placeholder="All statuses" options={[{ value: 'Paid', label: 'Paid' }, { value: 'Processing', label: 'Processing' }]} className="w-40" />
        </div>
        <DataTable columns={columns} data={data?.items || []} sort={filters.sort} onSort={sortBy} />
        <Pagination page={data?.page || 1} totalPages={data?.totalPages || 0} totalItems={data?.total || 0} pageSize={10} onPageChange={(page) => setFilter('page', page)} />
      </Card>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Update salary" description={editing && `Edit monthly salary details for ${editing.employeeName}.`} className="max-w-xl">{editing && <SalaryForm record={editing} onSubmit={save} onCancel={() => setEditing(null)} loading={update.isPending} />}</Modal>
    </>
  );
}
