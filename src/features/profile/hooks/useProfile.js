import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../../services/profileService';

export function useProfile(employeeId) {
  return useQuery({ queryKey: ['profile', employeeId], queryFn: () => profileService.getProfile(employeeId) });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, values }) => profileService.updateProfile(employeeId, values),
    onSuccess: (profile) => client.setQueryData(['profile', profile.id], profile),
  });
}
