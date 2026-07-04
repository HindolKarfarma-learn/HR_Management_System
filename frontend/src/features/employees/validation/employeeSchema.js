import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Enter the employee name.'),
  email: z.email('Enter a valid email.'),
  phone: z.string().min(10, 'Enter a valid phone number.'),
  department: z.string().min(1, 'Select a department.'),
  designation: z.string().min(2, 'Enter a designation.'),
  location: z.string().min(2, 'Enter a location.'),
  role: z.enum(['admin', 'employee'], { message: 'Select an account role.' }),
});
