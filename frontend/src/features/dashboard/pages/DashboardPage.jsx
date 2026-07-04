import { PageHeader } from '../../../components/layout/PageHeader';
import { ErrorState } from '../../../components/common/StateView';
import { PageSkeleton } from '../../../components/ui/Skeleton';
import { useAuthStore } from '../../../store/authStore';
import { useDashboard } from '../hooks/useDashboard';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useDashboard();
  if (isLoading) return <PageSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;
  return (
    <>
      <PageHeader title="Dashboard" description={`Here’s what’s happening at PeopleFlow today, ${user.firstName}.`} />
      {user.role === 'admin' ? <AdminDashboard data={data} /> : <EmployeeDashboard data={data} />}
    </>
  );
}
