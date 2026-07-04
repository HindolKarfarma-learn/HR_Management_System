import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/authService';
import { AuthHeader } from '../components/AuthHeader';
import { signupSchema } from '../validation/authSchemas';

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });
  const signup = useMutation({
    mutationFn: authService.signup,
    onSuccess: () => {
      toast.success('Account created. Check your email.');
      navigate('/verify-email');
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
      <AuthHeader eyebrow="Join your team" title="Create your account" description="Enter the details provided by your HR administrator." />
      <form className="space-y-4" onSubmit={handleSubmit((values) => signup.mutate(values))} noValidate>
        <Input label="Employee ID" placeholder="EMP-0000" error={errors.employeeId?.message} {...register('employeeId')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Work email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" size="lg" className="w-full" loading={signup.isPending}>Create account</Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link></p>
    </>
  );
}
