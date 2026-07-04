import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { profileSchema } from '../validation/profileSchema';

export function ProfileForm({ profile, onSubmit, onCancel, loading }) {
  const defaults = {
    ...profile,
    emergencyName: profile.emergencyContact.name,
    emergencyRelationship: profile.emergencyContact.relationship,
    emergencyPhone: profile.emergencyContact.phone,
  };
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: defaults });
  const submit = ({ emergencyName, emergencyRelationship, emergencyPhone, ...values }) => onSubmit({
    ...values,
    emergencyContact: { name: emergencyName, relationship: emergencyRelationship, phone: emergencyPhone },
  });
  return (
    <form className="space-y-4 p-6" onSubmit={handleSubmit(submit)} noValidate>
      <Input label="Full name" placeholder="Enter your full name" error={errors.name?.message} {...register('name')} />
      <Input label="Phone number" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
      <Input label="Address" placeholder="Enter your complete address" error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Date of birth" type="date" error={errors.birthDate?.message} {...register('birthDate')} />
        <Select label="Gender" placeholder="Select gender" options={[{ value: 'Female', label: 'Female' }, { value: 'Male', label: 'Male' }, { value: 'Non-binary', label: 'Non-binary' }, { value: 'Prefer not to say', label: 'Prefer not to say' }]} error={errors.gender?.message} {...register('gender')} />
        <Input label="Emergency contact" placeholder="Contact person’s name" error={errors.emergencyName?.message} {...register('emergencyName')} />
        <Input label="Relationship" placeholder="Parent, spouse, sibling…" error={errors.emergencyRelationship?.message} {...register('emergencyRelationship')} />
        <Input label="Emergency phone" placeholder="+91 98765 43210" error={errors.emergencyPhone?.message} {...register('emergencyPhone')} />
      </div>
      <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={loading}>Save profile</Button></div>
    </form>
  );
}
