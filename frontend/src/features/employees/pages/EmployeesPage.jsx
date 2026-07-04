import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Filter, UsersRound } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { SearchBar } from '../../../components/forms/SearchBar';
import { DataTable } from '../../../components/tables/DataTable';
import { Pagination } from '../../../components/tables/Pagination';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { ErrorState } from '../../../components/common/StateView';
import { EmployeeActions } from '../components/EmployeeActions';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployeeMutations, useEmployees } from '../hooks/useEmployees';

const statusVariant = { Active: 'success', 'On Leave': 'warning', Inactive: 'neutral' };

export default function EmployeesPage() {
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1, pageSize: 10, sort: { key: 'name', direction: 'asc' } });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { data, isLoading, isError, refetch } = useEmployees(filters);
  const { update, remove } = useEmployeeMutations();
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  const sortBy = (key) => setFilters((current) => ({ ...current, sort: { key, direction: current.sort.key === key && current.sort.direction === 'asc' ? 'desc' : 'asc' } }));
  const departments = ['Engineering', 'Product', 'Product Design', 'Sales', 'Marketing', 'Finance', 'People Operations', 'Customer Success', 'Operations'].map((value) => ({ value, label: value }));

  const columns = useMemo(() => [
    { key: 'name', label: 'Employee', sortable: true, render: (_, row) => <div className="flex items-center gap-3"><Avatar name={row.name} /><div><p className="font-semibold text-slate-800">{row.name}</p><p className="text-xs text-slate-500">{row.id}</p></div></div> },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={statusVariant[value]}>{value}</Badge> },
    { key: 'actions', label: '', render: (_, row) => <EmployeeActions employee={row} onEdit={setEditing} onDelete={setDeleting} /> },
  ], []);

  const saveEmployee = (values) => update.mutate({ id: editing.id, values }, {
    onSuccess: () => { toast.success('Employee updated'); setEditing(null); },
    onError: (error) => toast.error(error.message),
  });
  const deleteEmployee = () => remove.mutate(deleting.id, {
    onSuccess: () => { toast.success('Employee deleted'); setDeleting(null); },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
      <PageHeader title="Employees" description="Manage employee records and workforce information." />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row">
          <SearchBar value={filters.search} onChange={(value) => setFilter('search', value)} placeholder="Search name, ID, role…" className="flex-1" />
          <div className="flex gap-3">
            <Select options={departments} value={filters.department} onChange={(event) => setFilter('department', event.target.value)} placeholder="All departments" className="w-44" aria-label="Filter by department" />
            <Select options={[{ value: 'Active', label: 'Active' }, { value: 'On Leave', label: 'On leave' }]} value={filters.status} onChange={(event) => setFilter('status', event.target.value)} placeholder="All statuses" className="w-36" aria-label="Filter by status" />
          </div>
        </div>
        {isError ? <ErrorState onRetry={refetch} /> : isLoading && !data ? <div className="grid h-72 place-items-center text-sm text-slate-500"><Filter className="mb-2 size-6 animate-pulse" />Loading employees…</div> : (
          <>
            <DataTable columns={columns} data={data.items} sort={filters.sort} onSort={sortBy} emptyTitle="No employees match these filters" />
            <Pagination page={data.page} totalPages={data.totalPages} totalItems={data.total} pageSize={data.pageSize} onPageChange={(page) => setFilter('page', page)} />
          </>
        )}
      </Card>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><UsersRound className="size-3.5" />Employee records are provided by the employee service.</p>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit employee" description={editing && `Update information for ${editing.name}.`} className="max-w-2xl">
        {editing && <EmployeeForm employee={editing} onSubmit={saveEmployee} onCancel={() => setEditing(null)} loading={update.isPending} />}
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={deleteEmployee} loading={remove.isPending} title="Delete employee?" description={deleting && `This will remove ${deleting.name} from the employee directory.`} />
    </>
  );
}
