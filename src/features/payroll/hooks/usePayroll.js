import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '../../../services/payrollService';

export function usePayroll(params) {
  return useQuery({ queryKey: ['payroll', params], queryFn: () => payrollService.getPayroll(params), placeholderData: (previous) => previous });
}

export function useSalaryDetails(employeeId) {
  return useQuery({ queryKey: ['salary', employeeId], queryFn: () => payrollService.getSalaryDetails(employeeId), enabled: Boolean(employeeId) });
}

export function usePayrollActions() {
  const client = useQueryClient();
  return {
    update: useMutation({
      mutationFn: ({ employeeId, values }) => payrollService.updateSalary(employeeId, values),
      onSuccess: (record) => {
        client.setQueryData(['salary', record.employeeId], record);
        client.invalidateQueries({ queryKey: ['payroll'] });
      },
    }),
    download: useMutation({ mutationFn: payrollService.downloadPayslip }),
  };
}
