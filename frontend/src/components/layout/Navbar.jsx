import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

export function Navbar() {
  const { user, clearSession } = useAuthStore();
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const navigate = useNavigate();
  const logout = () => {
    clearSession();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation">
          <Menu className="size-5" />
        </button>
        <div>
          <p className="text-xs font-medium text-slate-500">Welcome back,</p>
          <p className="font-semibold text-slate-900">{user?.firstName || user?.name?.split(' ')[0]}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className="relative grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50" aria-label="Open user menu">
              <Avatar name={user?.name} src={user?.avatar} />
              <span className="hidden text-left md:block">
                <span className="block max-w-36 truncate text-sm font-semibold text-slate-800">{user?.name}</span>
                <span className="block text-xs capitalize text-slate-500">{user?.role}</span>
              </span>
              <ChevronDown className="hidden size-4 text-slate-400 md:block" />
            </button>
          }
        >
          <DropdownItem icon={UserRound} onClick={() => navigate('/profile')}>My profile</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>Settings</DropdownItem>
          <div className="my-1 border-t border-slate-100" />
          <DropdownItem icon={LogOut} onClick={logout} danger>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
