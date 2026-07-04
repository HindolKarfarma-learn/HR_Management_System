import { useState } from 'react';
import dayjs from 'dayjs';
import { ArrowLeft, BriefcaseBusiness, FileText, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { ErrorState } from '../../../components/common/StateView';
import { PageSkeleton } from '../../../components/ui/Skeleton';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployee, useEmployeeMutations } from '../hooks/useEmployees';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function EmployeeProfilePage() {
  const { employeeId } = useParams();
  const [editing, setEditing] = useState(false);
  const { data: employee, isLoading, isError, refetch } = useEmployee(employeeId);
  const { update } = useEmployeeMutations();
  if (isLoading) return <PageSkeleton />;
  if (isError) return <ErrorState title="Employee not found" onRetry={refetch} />;
  const save = (values) => update.mutate({ id: employee.id, values }, { onSuccess: () => { toast.success('Employee updated'); setEditing(false); } });
  return (
    <>
      <PageHeader title="Employee profile" description="Personal, employment, salary, and document details." action={<Button as={Link} to="/employees" variant="secondary"><ArrowLeft className="size-4" />Back to employees</Button>} />
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={employee.name} src={employee.avatar} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2><Badge variant="success">{employee.status}</Badge></div>
            <p className="mt-1 text-sm font-medium text-slate-600">{employee.designation} · {employee.department}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="flex items-center gap-1.5"><Mail className="size-4" />{employee.email}</span><span className="flex items-center gap-1.5"><Phone className="size-4" />{employee.phone}</span><span className="flex items-center gap-1.5"><MapPin className="size-4" />{employee.location}</span></div>
          </div>
          <Button onClick={() => setEditing(true)}><Pencil className="size-4" />Edit profile</Button>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader title="Personal details" /><CardContent className="grid gap-5 sm:grid-cols-2"><Detail label="Employee ID" value={employee.id} /><Detail label="Date of birth" value={employee.birthDate ? dayjs(employee.birthDate).format('DD MMM YYYY') : 'Not provided'} /><Detail label="Gender" value={employee.gender} /><Detail label="Address" value={employee.address} /></CardContent></Card>
        <Card><CardHeader title="Job details" /><CardContent className="grid gap-5 sm:grid-cols-2"><Detail label="Department" value={employee.department} /><Detail label="Manager" value={employee.manager} /><Detail label="Employment type" value={employee.employmentType} /><Detail label="Joined" value={dayjs(employee.joiningDate).format('DD MMM YYYY')} /></CardContent></Card>
        <Card><CardHeader title="Salary structure" /><CardContent className="space-y-3">{Object.entries(employee.salary).map(([key, value]) => <div key={key} className="flex justify-between border-b border-slate-100 pb-3 last:border-0"><span className="capitalize text-sm text-slate-500">{key}</span><strong className="text-sm text-slate-800">{currency.format(value)}</strong></div>)}</CardContent></Card>
        <Card><CardHeader title="Documents" /><CardContent className="space-y-3">{employee.documents.map((document) => <div key={document.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"><FileText className="size-5 text-brand-600" /><div className="flex-1"><p className="text-sm font-semibold text-slate-800">{document.name}</p><p className="text-xs text-slate-500">{document.type}</p></div><Button size="sm" variant="ghost">View</Button></div>)}</CardContent></Card>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit employee" className="max-w-2xl"><EmployeeForm employee={employee} onSubmit={save} onCancel={() => setEditing(false)} loading={update.isPending} /></Modal>
    </>
  );
}

function Detail({ label, value }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><BriefcaseBusiness className="size-4 text-slate-400" />{value}</p></div>;
}
