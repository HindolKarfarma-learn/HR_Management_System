import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/authService';
import { AuthHeader } from '../components/AuthHeader';
import { verificationSchema } from '../validation/authSchemas';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(verificationSchema) });
  const verify = useMutation({
    mutationFn: ({ code }) => authService.verifyEmail(code),
    onSuccess: ({ message }) => {
      toast.success(message);
      navigate('/login');
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <>
      <AuthHeader eyebrow="One last step" title="Verify your email" description="Enter the six-digit code sent to your work email. Use 123456 for this demo." />
      <form className="space-y-5" onSubmit={handleSubmit((values) => verify.mutate(values))} noValidate>
        <Input label="Verification code" inputMode="numeric" maxLength={6} className="text-center text-lg tracking-[0.4em]" error={errors.code?.message} {...register('code')} />
        <Button type="submit" size="lg" className="w-full" loading={verify.isPending}>Verify email</Button>
      </form>
    </>
  );
}
