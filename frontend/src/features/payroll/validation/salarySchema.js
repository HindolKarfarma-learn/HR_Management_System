import { z } from 'zod';

const amount = z.coerce.number().min(0, 'Amount cannot be negative.');

export const salarySchema = z.object({
  basic: amount,
  hra: amount,
  allowances: amount,
  variable: amount,
  deductions: amount,
});
