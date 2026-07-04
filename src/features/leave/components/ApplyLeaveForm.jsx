import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { DatePicker } from '../../../components/forms/DatePicker';
import { Select } from '../../../components/ui/Select';
import { leaveSchema } from '../validation/leaveSchema';

export function ApplyLeaveForm({ onSubmit, onCancel, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: { type: '', startDate: '', endDate: '', reason: '' },
  });
  const submit = (values) => onSubmit({ ...values, days: dayjs(values.endDate).diff(dayjs(values.startDate), 'day') + 1 });
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 p-6" noValidate>
      <Select label="Leave type" options={['Annual Leave', 'Sick Leave', 'Casual Leave', 'Compensatory Off'].map((value) => ({ value, label: value }))} error={errors.type?.message} {...register('type')} />
      <div className="grid grid-cols-2 gap-4">
        <DatePicker label="Start date" error={errors.startDate?.message} {...register('startDate')} />
        <DatePicker label="End date" error={errors.endDate?.message} {...register('endDate')} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="leave-reason" className="block text-sm font-medium text-slate-700">Reason</label>
        <textarea id="leave-reason" rows={4} className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm" placeholder="Briefly explain your leave request…" {...register('reason')} />
        {errors.reason && <p className="text-xs text-red-600">{errors.reason.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={loading}>Submit request</Button></div>
    </form>
  );
}
