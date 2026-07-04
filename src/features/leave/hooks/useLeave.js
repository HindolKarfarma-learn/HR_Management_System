import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leaveService } from '../../../services/leaveService';

export function useLeaveRequests(params) {
  return useQuery({ queryKey: ['leave', params], queryFn: () => leaveService.getLeaveRequests(params), placeholderData: (previous) => previous });
}

export function useLeaveBalance() {
  return useQuery({ queryKey: ['leave-balance'], queryFn: leaveService.getLeaveBalance });
}

export function useLeaveActions() {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: ['leave'] });
  return {
    apply: useMutation({ mutationFn: ({ values, employee }) => leaveService.applyLeave(values, employee), onSuccess: invalidate }),
    updateStatus: useMutation({ mutationFn: ({ id, status, comments }) => leaveService.updateLeaveStatus(id, status, comments), onSuccess: invalidate }),
  };
}
