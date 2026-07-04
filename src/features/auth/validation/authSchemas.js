import { z } from 'zod';

const email = z.email('Enter a valid work email.');
const password = z.string().min(8, 'Password must contain at least 8 characters.');

export const loginSchema = z.object({ email, password });

export const signupSchema = z.object({
  employeeId: z.string().regex(/^EMP-\d{4}$/, 'Use the format EMP-0000.'),
  firstName: z.string().min(2, 'Enter your first name.'),
  lastName: z.string().min(2, 'Enter your last name.'),
  email,
  password: password.regex(/[A-Z]/, 'Include an uppercase letter.').regex(/\d/, 'Include a number.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const emailSchema = z.object({ email });

export const verificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code.'),
});

export const resetPasswordSchema = z.object({
  password: password.regex(/[A-Z]/, 'Include an uppercase letter.').regex(/\d/, 'Include a number.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});
