import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../../../services/employeeService';

export function useEmployees(params) {
  return useQuery({ queryKey: ['employees', params], queryFn: () => employeeService.getEmployees(params), placeholderData: (previous) => previous });
}

export function useEmployee(id) {
  return useQuery({ queryKey: ['employee', id], queryFn: () => employeeService.getEmployee(id), enabled: Boolean(id) });
}

export function useEmployeeMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['employees'] });
  const update = useMutation({
    mutationFn: ({ id, values }) => employeeService.updateEmployee(id, values),
    onSuccess: (employee) => {
      queryClient.setQueryData(['employee', employee.id], employee);
      invalidate();
    },
  });
  const remove = useMutation({ mutationFn: employeeService.deleteEmployee, onSuccess: invalidate });
  return { update, remove };
}
