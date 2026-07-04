import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import { NotFoundPage, UnauthorizedPage } from './ErrorPages';
import ModulePlaceholderPage from './ModulePlaceholderPage';
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8"><PageSkeleton /></div>}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ModulePlaceholderPage title="Dashboard" description="Your organization at a glance." />} />
            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/employees/*" element={<ModulePlaceholderPage title="Employees" description="Manage your workforce and employee records." />} />
            </Route>
            <Route path="/attendance/*" element={<ModulePlaceholderPage title="Attendance" description="Track time, shifts, and attendance trends." />} />
            <Route path="/leave/*" element={<ModulePlaceholderPage title="Leave" description="Plan and manage employee time off." />} />
            <Route path="/payroll/*" element={<ModulePlaceholderPage title="Payroll" description="Review compensation and payslips." />} />
            <Route path="/profile" element={<ModulePlaceholderPage title="Profile" description="Manage your personal and professional information." />} />
            <Route path="/settings" element={<ModulePlaceholderPage title="Settings" description="Configure your PeopleFlow workspace." />} />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
