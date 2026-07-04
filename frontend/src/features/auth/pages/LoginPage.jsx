import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LockKeyhole, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authService } from '../../../services/authService';
import { useAuthStore } from '../../../store/authStore';
import { AuthHeader } from '../components/AuthHeader';
import { loginSchema } from '../validation/authSchemas';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session);
      toast.success(`Welcome back, ${session.user.firstName}`);
      navigate(location.state?.from || '/dashboard', { replace: true });
    },
    onError: (error) => toast.error(error.message),
  });

  const fillDemo = (role) => {
    setValue('email', role === 'admin' ? 'admin@peopleflow.io' : 'employee@peopleflow.io');
    setValue('password', role === 'admin' ? 'Admin@123' : 'Employee@123');
  };

  return (
    <>
      <AuthHeader eyebrow="Welcome back" title="Sign in to PeopleFlow" description="Use your company credentials to access your workspace." />
      <form className="space-y-5" onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
        <Input label="Work email" type="email" icon={Mail} placeholder="you@company.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <div>
          <Input label="Password" type="password" icon={LockKeyhole} placeholder="Enter your password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          <div className="mt-2 text-right"><Link to="/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Forgot password?</Link></div>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={login.isPending}>Sign in</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />Demo access<span className="h-px flex-1 bg-slate-200" /></div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => fillDemo('admin')}>Admin account</Button>
        <Button variant="secondary" onClick={() => fillDemo('employee')}>Employee account</Button>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">New to PeopleFlow? <Link to="/signup" className="font-semibold text-brand-600">Create account</Link></p>
    </>
  );
}
