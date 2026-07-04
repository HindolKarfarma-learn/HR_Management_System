import { ChevronLeft, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { navigationItems } from '../../constants/navigation';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { Brand } from './Brand';

export function Sidebar({ mobile = false, onNavigate }) {
  const { user, clearSession } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const collapsed = !mobile && sidebarCollapsed;
  const items = navigationItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  const logout = () => {
    clearSession();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={cn('flex h-20 items-center border-b border-slate-100 px-5', collapsed && 'justify-center px-3')}>
        <Brand compact={collapsed} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Primary navigation">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) => cn(
              'flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              collapsed && 'justify-center px-0',
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <Avatar name={user?.name} src={user?.avatar} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="truncate text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
          </div>
        )}
        <button type="button" onClick={logout} className={cn('flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600', collapsed && 'justify-center px-0')}>
          <LogOut className="size-5" />
          {!collapsed && 'Logout'}
        </button>
      </div>
      {!mobile && (
        <button type="button" onClick={toggleSidebar} className="absolute -right-3 top-24 grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-brand-600" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      )}
    </div>
  );
}
