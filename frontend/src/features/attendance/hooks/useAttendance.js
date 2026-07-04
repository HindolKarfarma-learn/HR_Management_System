import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../../../services/attendanceService';

export function useAttendance(params) {
  return useQuery({ queryKey: ['attendance', params], queryFn: () => attendanceService.getAttendance(params), placeholderData: (previous) => previous });
}

export function useAttendanceSummary(employeeId) {
  return useQuery({ queryKey: ['attendance-summary', employeeId], queryFn: () => attendanceService.getEmployeeSummary(employeeId), enabled: Boolean(employeeId) });
}

export function useAttendanceActions() {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: ['attendance'] });
  return {
    checkIn: useMutation({ mutationFn: attendanceService.checkIn, onSuccess: invalidate }),
    checkOut: useMutation({ mutationFn: attendanceService.checkOut, onSuccess: invalidate }),
  };
}
