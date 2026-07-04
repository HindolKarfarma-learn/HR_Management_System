import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { profileSchema } from '../validation/profileSchema';

export function ProfileForm({ profile, onSubmit, onCancel, loading }) {
  const defaults = { ...profile, emergencyName: profile.emergencyContact.name, emergencyPhone: profile.emergencyContact.phone };
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: defaults });
  const submit = ({ emergencyName, emergencyPhone, ...values }) => onSubmit({ ...values, emergencyContact: { ...profile.emergencyContact, name: emergencyName, phone: emergencyPhone } });
  return (
    <form className="space-y-4 p-6" onSubmit={handleSubmit(submit)} noValidate>
      <Input label="Full name" error={errors.name?.message} {...register('name')} />
      <Input label="Phone number" error={errors.phone?.message} {...register('phone')} />
      <Input label="Address" error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Emergency contact" error={errors.emergencyName?.message} {...register('emergencyName')} />
        <Input label="Emergency phone" error={errors.emergencyPhone?.message} {...register('emergencyPhone')} />
      </div>
      <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={loading}>Save profile</Button></div>
    </form>
  );
}
