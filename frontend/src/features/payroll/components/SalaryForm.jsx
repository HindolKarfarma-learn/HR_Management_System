import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { salarySchema } from '../validation/salarySchema';

export function SalaryForm({ record, onSubmit, onCancel, loading }) {
  const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(salarySchema), defaultValues: record });
  useEffect(() => reset(record), [record, reset]);
  return (
    <form className="space-y-4 p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        {['basic', 'hra', 'allowances', 'variable', 'deductions'].map((field) => <Input key={field} label={field[0].toUpperCase() + field.slice(1)} type="number" error={errors[field]?.message} {...register(field)} />)}
      </div>
      <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={loading}>Update salary</Button></div>
    </form>
  );
}
