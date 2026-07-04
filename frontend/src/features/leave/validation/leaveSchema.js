import { z } from 'zod';

export const leaveSchema = z.object({
  type: z.string().min(1, 'Select a leave type.'),
  startDate: z.string().min(1, 'Select a start date.'),
  endDate: z.string().min(1, 'Select an end date.'),
  reason: z.string().min(10, 'Provide at least 10 characters.').max(250, 'Keep the reason under 250 characters.'),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  path: ['endDate'],
  message: 'End date cannot be before the start date.',
});
