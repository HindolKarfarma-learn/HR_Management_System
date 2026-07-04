import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboardService';
import { useAuthStore } from '../../../store/authStore';

export function useDashboard() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['dashboard', user.role, user.id],
    queryFn: () => dashboardService.getDashboard({ role: user.role, employeeId: user.id }),
  });
}
