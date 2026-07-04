import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Skeleton';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import { NotFoundPage, UnauthorizedPage } from './ErrorPages';
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const EmployeesPage = lazy(() => import('../features/employees/pages/EmployeesPage'));
const EmployeeProfilePage = lazy(() => import('../features/employees/pages/EmployeeProfilePage'));
const AttendancePage = lazy(() => import('../features/attendance/pages/AttendancePage'));
const LeavePage = lazy(() => import('../features/leave/pages/LeavePage'));
const PayrollPage = lazy(() => import('../features/payroll/pages/PayrollPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('../features/profile/pages/SettingsPage'));

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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
            </Route>
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
