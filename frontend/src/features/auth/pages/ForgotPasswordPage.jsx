import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/authService';
import { AuthHeader } from '../components/AuthHeader';
import { emailSchema } from '../validation/authSchemas';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(emailSchema) });
  const requestReset = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: ({ message }) => toast.success(message),
    onError: (error) => toast.error(error.message),
  });
  return (
    <>
      <AuthHeader eyebrow="Account recovery" title="Forgot your password?" description="Enter your work email and we’ll send secure reset instructions." />
      <form className="space-y-5" onSubmit={handleSubmit((values) => requestReset.mutate(values))} noValidate>
        <Input label="Work email" icon={Mail} type="email" error={errors.email?.message} {...register('email')} />
        <Button type="submit" size="lg" className="w-full" loading={requestReset.isPending}>Send reset link</Button>
      </form>
      <Link to="/login" className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600"><ArrowLeft className="size-4" />Back to sign in</Link>
    </>
  );
}
