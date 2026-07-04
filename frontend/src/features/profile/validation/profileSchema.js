import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Enter your full name.'),
  phone: z.string().min(10, 'Enter a valid phone number.'),
  address: z.string().min(8, 'Enter your complete address.'),
  birthDate: z.string().min(1, 'Select your date of birth.'),
  gender: z.string().min(1, 'Select your gender.'),
  emergencyName: z.string().min(2, 'Enter a contact name.'),
  emergencyRelationship: z.string().min(2, 'Enter the relationship.'),
  emergencyPhone: z.string().min(10, 'Enter a valid phone number.'),
});
