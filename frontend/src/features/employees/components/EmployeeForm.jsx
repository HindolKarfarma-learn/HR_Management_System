import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { employeeSchema } from '../validation/employeeSchema';

export function EmployeeForm({ employee, onSubmit, onCancel, loading }) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee,
  });
  useEffect(() => reset(employee), [employee, reset]);
  const departments = ['Engineering', 'Product', 'Product Design', 'Sales', 'Marketing', 'Finance', 'People Operations', 'Customer Success', 'Operations'].map((value) => ({ value, label: value }));
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" error={errors.name?.message} {...register('name')} />
        <Input label="Work email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        <Select label="Department" options={departments} error={errors.department?.message} {...register('department')} />
        <Input label="Designation" error={errors.designation?.message} {...register('designation')} />
        <Input label="Location" error={errors.location?.message} {...register('location')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save changes</Button>
      </div>
    </form>
  );
}
