import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/authService';
import { AuthHeader } from '../components/AuthHeader';
import { resetPasswordSchema } from '../validation/authSchemas';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetPasswordSchema) });
  const reset = useMutation({
    mutationFn: (values) => authService.resetPassword({ ...values, token: searchParams.get('token') }),
    onSuccess: ({ message }) => {
      toast.success(message);
      navigate('/login');
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <>
      <AuthHeader eyebrow="Secure your account" title="Set a new password" description="Choose a strong password you haven’t used before." />
      <form className="space-y-5" onSubmit={handleSubmit((values) => reset.mutate(values))} noValidate>
        <Input label="New password" type="password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" size="lg" className="w-full" loading={reset.isPending}>Reset password</Button>
      </form>
    </>
  );
}
