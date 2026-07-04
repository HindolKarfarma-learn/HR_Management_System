import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export function RoleRoute({ roles }) {
  const user = useAuthStore((state) => state.user);
  return roles.includes(user?.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
